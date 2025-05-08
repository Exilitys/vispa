"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../utils/supabase/Server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Login failed:", error.message); // Add error message logging
    redirect("/error");
  }

  revalidatePath("/home", "layout");
  redirect("/home");
}
export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    name: formData.get("name") as string,
  };

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
      },
    },
  });

  if (signUpError || !signUpData.user) {
    console.error("Signup failed:", signUpError?.message);
    redirect("/error");
  }

  // Attempt login immediately after signup
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (loginError) {
    console.error("Login failed after sign-up:", loginError.message);
    redirect("/error");
  }

  revalidatePath("/home", "layout");
  redirect("/home");
}
