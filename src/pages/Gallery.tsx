import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Loader2, ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GalleryItem {
  id: string;
  profile_id: string;
  image_url: string;
  caption: string;
  display_order: number;
  created_at: string;
}

const MAX_PHOTOS = 20;

const Gallery = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("gallery")
        .select("*")
        .eq("profile_id", profile.id)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      setImages((data as GalleryItem[]) || []);
      setLoading(false);
    };
    fetch();
  }, [profile?.id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !profile) return;

    if (images.length >= MAX_PHOTOS) {
      toast.error(`Maximum ${MAX_PHOTOS} photos allowed`);
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and WebP images are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("gallery").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(filePath);

      const { data: inserted, error: insertError } = await supabase
        .from("gallery")
        .insert({ profile_id: profile.id, image_url: urlData.publicUrl, caption: "" })
        .select()
        .single();

      if (insertError) throw insertError;
      setImages(prev => [...prev, inserted as GalleryItem]);
      toast.success("Photo added to gallery");
    } catch (err) {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    try {
      // Extract path from URL
      const url = new URL(item.image_url);
      const pathParts = url.pathname.split("/storage/v1/object/public/gallery/");
      if (pathParts[1]) {
        await supabase.storage.from("gallery").remove([decodeURIComponent(pathParts[1])]);
      }
      await supabase.from("gallery").delete().eq("id", item.id);
      setImages(prev => prev.filter(i => i.id !== item.id));
      toast.success("Photo removed");
    } catch {
      toast.error("Failed to delete photo");
    }
  };

  const handleCaptionUpdate = async (id: string, caption: string) => {
    await supabase.from("gallery").update({ caption }).eq("id", id);
    setImages(prev => prev.map(i => (i.id === id ? { ...i, caption } : i)));
  };

  if (authLoading || profileLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    navigate("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">My Gallery</h1>
          </div>
          <span className="text-sm text-muted-foreground">{images.length} / {MAX_PHOTOS} photos</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Upload button */}
        <div className="relative">
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading || images.length >= MAX_PHOTOS}
          />
          <Button className="w-full" variant="outline" disabled={uploading || images.length >= MAX_PHOTOS}>
            {uploading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</>
            ) : (
              <><Plus className="w-4 h-4 mr-2" />Add Photo</>
            )}
          </Button>
        </div>

        {/* Gallery grid */}
        {images.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3 icon-float" />
            <p className="text-muted-foreground">No photos yet</p>
            <p className="text-sm text-muted-foreground">Showcase your work to attract customers</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {images.map((item) => (
              <div key={item.id} className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
                <div className="aspect-square relative">
                  <img
                    src={item.image_url}
                    alt={item.caption || "Gallery image"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <button
                    onClick={() => handleDelete(item)}
                    className="absolute top-2 right-2 w-8 h-8 bg-destructive/90 rounded-full flex items-center justify-center tap-scale"
                  >
                    <Trash2 className="w-4 h-4 text-destructive-foreground" />
                  </button>
                </div>
                <div className="p-2">
                  <Input
                    placeholder="Add caption..."
                    value={item.caption}
                    onChange={(e) => setImages(prev => prev.map(i => i.id === item.id ? { ...i, caption: e.target.value } : i))}
                    onBlur={(e) => handleCaptionUpdate(item.id, e.target.value)}
                    className="text-xs h-8 border-0 bg-transparent px-1 focus-visible:ring-0"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
