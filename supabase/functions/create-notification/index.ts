import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationPayload {
  user_id: string;
  user_type: "customer" | "professional";
  type: string;
  title: string;
  message: string;
  data?: Record<string, string | number | boolean | null>;
}

// Allowed notification types to prevent abuse
const ALLOWED_TYPES = ["booking", "payment", "review", "message", "system"];

// Max lengths for input validation
const MAX_TITLE_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 1000;

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the request is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with user's auth
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify the user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const requestingUserId = userData.user.id;

    // Parse request body
    const payload: NotificationPayload = await req.json();

    // Validate required fields
    if (!payload.user_id || !payload.user_type || !payload.type || !payload.title || !payload.message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate notification type
    if (!ALLOWED_TYPES.includes(payload.type)) {
      return new Response(
        JSON.stringify({ error: "Invalid notification type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate input lengths
    if (payload.title.length > MAX_TITLE_LENGTH || payload.message.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({ error: "Title or message exceeds maximum length" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate UUID format for user_id
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(payload.user_id)) {
      return new Response(
        JSON.stringify({ error: "Invalid user_id format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // AUTHORIZATION CHECK: Verify the requesting user has a relationship
    // with the target user (through bookings or conversations)
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Check if the requesting user has a booking or conversation relationship with the target
    const hasRelationship = await verifyRelationship(adminClient, requestingUserId, payload.user_id);
    
    if (!hasRelationship) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: No relationship with target user" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const insertData: Record<string, unknown> = {
      user_id: payload.user_id,
      user_type: payload.user_type,
      type: payload.type,
      title: payload.title,
      message: payload.message,
    };

    if (payload.data) {
      insertData.data = payload.data;
    }

    const { error: insertError } = await adminClient
      .from("notifications")
      .insert([insertData]);

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create notification" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Verify that the requesting user has a legitimate relationship with the target user.
 * Checks bookings and conversations tables for any connection between the two users.
 */
async function verifyRelationship(
  adminClient: ReturnType<typeof createClient>,
  requestingAuthUserId: string,
  targetAuthUserId: string
): Promise<boolean> {
  // If sending to self, allow it
  if (requestingAuthUserId === targetAuthUserId) {
    return true;
  }

  // Get the requesting user's profile (professional) and customer profile
  const [reqProfileResult, reqCustomerResult] = await Promise.all([
    adminClient.from("profiles").select("id").eq("user_id", requestingAuthUserId).maybeSingle(),
    adminClient.from("customer_profiles").select("id").eq("user_id", requestingAuthUserId).maybeSingle(),
  ]);

  // Get the target user's profile (professional) and customer profile
  const [targetProfileResult, targetCustomerResult] = await Promise.all([
    adminClient.from("profiles").select("id").eq("user_id", targetAuthUserId).maybeSingle(),
    adminClient.from("customer_profiles").select("id").eq("user_id", targetAuthUserId).maybeSingle(),
  ]);

  const reqProfileId = reqProfileResult.data?.id;
  const reqCustomerId = reqCustomerResult.data?.id;
  const targetProfileId = targetProfileResult.data?.id;
  const targetCustomerId = targetCustomerResult.data?.id;

  // Check bookings relationship: professional <-> customer
  if (reqProfileId && targetCustomerId) {
    const { data: booking } = await adminClient
      .from("bookings")
      .select("id")
      .eq("professional_id", reqProfileId)
      .eq("customer_id", targetCustomerId)
      .limit(1)
      .maybeSingle();
    if (booking) return true;
  }

  if (reqCustomerId && targetProfileId) {
    const { data: booking } = await adminClient
      .from("bookings")
      .select("id")
      .eq("customer_id", reqCustomerId)
      .eq("professional_id", targetProfileId)
      .limit(1)
      .maybeSingle();
    if (booking) return true;
  }

  // Check conversations relationship
  if (reqProfileId && targetCustomerId) {
    const { data: conv } = await adminClient
      .from("conversations")
      .select("id")
      .eq("professional_id", reqProfileId)
      .eq("customer_id", targetCustomerId)
      .limit(1)
      .maybeSingle();
    if (conv) return true;
  }

  if (reqCustomerId && targetProfileId) {
    const { data: conv } = await adminClient
      .from("conversations")
      .select("id")
      .eq("customer_id", reqCustomerId)
      .eq("professional_id", targetProfileId)
      .limit(1)
      .maybeSingle();
    if (conv) return true;
  }

  return false;
}
