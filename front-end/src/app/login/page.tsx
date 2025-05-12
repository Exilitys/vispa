"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { login, signup } from "./action";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent default form submission
    setisLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      if (isLogin) {
        const error = await login(formData);
        setErrorMessage(error || null);
      } else {
        const error = await signup(formData);
        setErrorMessage(error || null);
      }
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/70">
          <Spinner size={"lg"} className="bg-black dark:bg-white" />
        </div>
      )}
      <div className="h-screen flex justify-center items-center">
        <div className="border-2 shadow-2xl border-gray-400 shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
            Welcome to VISPA
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 text-center">
            {isLogin ? "Login to VISPA" : "Register for VISPA"} to enter your
            learning experience
          </p>

          <form className="my-8 space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <LabelInputContainer>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Tyler" type="text" />
              </LabelInputContainer>
            )}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="projectmayhem@fc.com"
                type="email"
                name="email"
                required
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                required
              />
            </LabelInputContainer>

            <button
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-blue-500 to-blue-400 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] hover:cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              {isLogin ? "Login" : "Sign Up"} &rarr;
              <BottomGradient />
            </button>
            <p className="text-red-500 text-center">{errorMessage}</p>

            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
            <div className="text-center">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </div>
            <div className="text-center">
              <div className="flex justify-center gap-6 text-white text-xl mb-4">
                <Link href="https://www.facebook.com">
                  <FaFacebookF className="text-blue-500" />
                </Link>
                <Link href="https://www.instagram.com">
                  <FaInstagram className="text-purple-500" />
                </Link>
                <Link href="https://www.youtube.com">
                  <FaYoutube className="text-red-500" />
                </Link>
              </div>
              <p className="text-sm text-gray-400">© Copyright 2025 - VISPA</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
