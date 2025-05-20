"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { createClient } from "../../../utils/supabase/Client";
import { useRouter } from "next/navigation";
import { Pencil, Check, X } from "lucide-react";

const supabase = createClient();

export default function ProfilePicture() {
  const [profile, setProfile] = useState<{
    name: string;
    profile_picture: string;
    created_at: string;
  } | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);

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
      setNewName(data.name);
    };

    fetchProfile();
  }, []);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUploadError("Not authenticated.");
        setUploading(false);
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
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

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-picture").getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("MsUser")
        .update({ profile_picture: publicUrl })
        .eq("uuid", user.id);

      if (updateError) {
        setUploadError(updateError.message);
        setUploading(false);
        return;
      }

      setProfile((prev) =>
        prev ? { ...prev, profile_picture: publicUrl } : prev
      );
    } catch (err) {
      setUploadError((err as Error).message || "Unknown error");
    }
    setUploading(false);
  };

  const handleNameUpdate = async () => {
    setSavingName(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated.");

      const { error } = await supabase
        .from("MsUser")
        .update({ name: newName })
        .eq("uuid", user.id);

      if (error) throw error;

      setProfile((prev) => (prev ? { ...prev, name: newName } : prev));
      setEditing(false);
    } catch (err) {
      console.error("Failed to update name:", err);
    }
    setSavingName(false);
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

      {/* Name with edit icon */}
      <div className="flex items-center gap-2 mb-1">
        {editing ? (
          <>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-2 w-40 py-1 rounded-md border border-gray-300 dark:bg-gray-800 dark:text-white"
            />
            <button onClick={handleNameUpdate} disabled={savingName}>
              <Check size={18} className="text-green-500" />
            </button>
            <button onClick={() => setEditing(false)}>
              <X size={18} className="text-red-500" />
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold">
              {profile.name.charAt(0).toUpperCase() +
                profile.name.slice(1).toLowerCase()}
            </h2>
            <button onClick={() => setEditing(true)}>
              <Pencil size={16} className="text-gray-500 hover:text-gray-700" />
            </button>
          </>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Joined {joinedDate}
      </p>
    </section>
  );
}
