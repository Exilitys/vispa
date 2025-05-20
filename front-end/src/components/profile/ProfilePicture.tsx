"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { createClient } from "../../../utils/supabase/Client";
import { useRouter } from "next/navigation";

const supabase = createClient();

export default function ProfilePicture() {
  const [profile, setProfile] = useState<{
    name: string;
    profile_picture: string;
    created_at: string;
  } | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error getting user:", userError);
        router.push("/login");
        return;
      }

      // 👍 THIS LINE WORKS NOW
      console.log("Current user UUID:", user.id);

      const { data, error } = await supabase
        .from("MsUser")
        .select("name, profile_picture, created_at")
        .eq("uuid", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setProfile(data);
    };

    fetchProfile();
  }, []);

  // Handle profile picture upload
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    setUploading(true);

    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUploadError("Not authenticated.");
        setUploading(false);
        return;
      }

      // Upload image to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("profile-picture")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        setUploadError(uploadError.message);
        setUploading(false);
        return;
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-picture").getPublicUrl(filePath);

      // Update the user's profile_picture in MsUser
      const { error: updateError } = await supabase
        .from("MsUser")
        .update({ profile_picture: publicUrl })
        .eq("uuid", user.id);

      if (updateError) {
        setUploadError(updateError.message);
        setUploading(false);
        return;
      }

      // Refresh the profile
      setProfile((prev) =>
        prev ? { ...prev, profile_picture: publicUrl } : prev
      );
    } catch (err: any) {
      setUploadError(err.message || "Unknown error");
    }
    setUploading(false);
  };

  if (!profile) return <p className="text-center p-6">Loading...</p>;

  const joinedDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <section className="flex flex-col items-center text-center p-6 dark:bg-gray-900 rounded-lg max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      <div className="w-40 h-40 relative mb-4">
        <img
          src={profile.profile_picture || "/Image/profile-picture.jpg"}
          alt="Profile Picture"
          className="rounded-full border-2 border-white shadow-md w-40 h-40 object-cover"
        />
        <label className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs cursor-pointer">
          {uploading ? "Uploading..." : "Change"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            disabled={uploading}
          />
        </label>
      </div>

      {uploadError && (
        <p className="text-sm text-red-500 mb-2">{uploadError}</p>
      )}

      <h2 className="text-xl font-semibold">
        {profile.name.charAt(0).toUpperCase() +
          profile.name.slice(1).toLowerCase()}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Joined {joinedDate}
      </p>
    </section>
  );
}
