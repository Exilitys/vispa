"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { createClient } from "../../../utils/supabase/Client";

const Navbar: React.FC = () => {
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const supabase = createClient();
  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("MsUser")
          .select("name, profile_picture, created_at")
          .eq("uuid", user.id)
          .single();

        if (data?.profile_picture) {
          setProfileUrl(data.profile_picture);
        }
      }
      console.log(profileUrl);
    };

    fetchUserProfile();
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold">VISPA</span>
      </div>

      <div className="flex w-full justify-evenly mx-3 lg:w-1/2 lg:mr-auto">
        {["Home", "Learn", "Play", "About"].map((link) => (
          <a
            key={link}
            href={`/${link.toLowerCase()}`}
            className="text-gray-700 hover:text-black transition-colors"
          >
            {link}
          </a>
        ))}
      </div>

      <div className="flex items-center rounded-full">
        <Link href="/profile">
          <img
            src={profileUrl || "/Image/profile-picture.jpg"}
            alt="Profile Picture"
            width={40}
            height={40}
            className="rounded-full border border-gray-300"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
