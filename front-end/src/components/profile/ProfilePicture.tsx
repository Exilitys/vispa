"use client";

import { useEffect, useState } from "react";

import { createClient } from "../../../utils/supabase/Client";
const supabase = createClient();

export default function ProfilePicture() {
  const [profile, setProfile] = useState<{
    name: string;
    profile_picture: string;
    created_at: string;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error getting user:", userError);
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
    };

    fetchProfile();
  }, [supabase]);

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
          className="rounded-full border-2 border-white shadow-md"
        />
      </div>

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
