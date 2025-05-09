import type { NextConfig } from "next";
import { redirect } from "next/dist/server/api-utils";

const nextConfig: NextConfig = {
  /* config options here */
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    redirect: false,
  },
  images: {
    domains: ["1drv.ms"],
  },
};

export default nextConfig;
