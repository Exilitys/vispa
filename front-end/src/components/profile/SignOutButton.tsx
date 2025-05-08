// app/components/profile/SignOutButton.tsx
"use client";

import { createClient } from "../../../utils/supabase/Client";
import { Button } from "../ui/button";

export default function SignOutButton() {
  const supabase = createClient();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error.message);
    } else {
      window.location.href = "/"; // redirect after sign-out
    }
  };

  return (
    <Button
      className="text-white bg-red-500 hover:cursor-pointer hover:bg-red-400"
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  );
}
