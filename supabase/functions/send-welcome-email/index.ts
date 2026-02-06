import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface WelcomeEmailRequest {
  email: string;
  fullName: string;
  accountType: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resend = new Resend(resendApiKey);
    const { email, fullName, accountType }: WelcomeEmailRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const displayName = fullName || email.split("@")[0];
    const roleLabel = accountType === "professional" ? "Professional" : "Handyman";

    const emailResponse = await resend.emails.send({
      from: "BusinessHandyman <onboarding@resend.dev>",
      to: [email],
      subject: `Welcome to BusinessHandyman, ${displayName}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 32px 32px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">BusinessHandyman</h1>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding: 32px;">
                      <h2 style="color: #18181b; margin: 0 0 16px; font-size: 20px;">Welcome aboard, ${displayName}! 🎉</h2>
                      <p style="color: #3f3f46; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
                        Your <strong>${roleLabel}</strong> account has been created successfully. You're all set to start using BusinessHandyman.
                      </p>
                      <p style="color: #3f3f46; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                        Here's what you can do next:
                      </p>
                      <ul style="color: #3f3f46; font-size: 15px; line-height: 1.8; margin: 0 0 24px; padding-left: 20px;">
                        <li>Complete your profile with your skills and experience</li>
                        <li>Upload your certifications and documents</li>
                        <li>Set your rates and availability</li>
                        <li>Start receiving booking requests</li>
                      </ul>
                      <p style="color: #71717a; font-size: 13px; line-height: 1.5; margin: 0;">
                        If you have any questions, don't hesitate to reach out. We're here to help!
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 32px; border-top: 1px solid #e4e4e7; text-align: center;">
                      <p style="color: #a1a1aa; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} BusinessHandyman. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error sending welcome email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
