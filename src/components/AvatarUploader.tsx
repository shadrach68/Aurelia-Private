"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Camera, Trash2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

export default function AvatarUploader({
  userId,
  fullName,
  currentAvatarUrl,
}: {
  userId: string;
  fullName: string;
  currentAvatarUrl: string | null;
}) {
  const supabase = createClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, or WebP).");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError("Image must be smaller than 3 MB.");
      return;
    }

    setUploading(true);

    const fileExt = file.name.split(".").pop() || "jpg";
    const filePath = `${userId}/${Date.now()}.${fileExt}`;

    // 1. Upload image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setUploading(false);
      setError(uploadError.message);
      return;
    }

    // 2. Retrieve public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    // 3. Save URL to profile via secure RPC
    const { error: rpcError } = await supabase.rpc("update_own_avatar", {
      new_avatar_url: publicUrl,
    });

    setUploading(false);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    setAvatarUrl(publicUrl);
    setSuccess("Profile portrait updated.");
    router.refresh();
  }

  async function handleRemoveAvatar() {
    setError("");
    setSuccess("");
    setUploading(true);

    const { error: rpcError } = await supabase.rpc("update_own_avatar", {
      new_avatar_url: null,
    });

    setUploading(false);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    setAvatarUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSuccess("Profile portrait removed. Default initials restored.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <UserAvatar
          fullName={fullName}
          avatarUrl={avatarUrl}
          sizeClass="w-20 h-20"
          textSizeClass="text-2xl"
        />

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-[#C5A46D] text-[#080C12] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 hover:bg-[#D9BC89] transition disabled:opacity-50 cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Camera size={15} />{" "}
                  {avatarUrl ? "Change Photo" : "Upload Photo"}
                </>
              )}
            </button>

            {avatarUrl && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={uploading}
                className="border border-white/15 text-gray-300 px-4 py-2.5 text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:border-red-400/50 hover:text-red-400 transition disabled:opacity-50 cursor-pointer"
              >
                <Trash2 size={14} /> Use Initials
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500">
            JPG, PNG, or WebP up to 3 MB. If no photo is uploaded, your initials
            will be displayed automatically.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3.5">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 p-3.5">
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
}
