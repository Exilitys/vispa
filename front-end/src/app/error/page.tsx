"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-white dark:bg-black px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Oops! Something went wrong
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        We're sorry, but an unexpected error has occurred.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition hover:cursor-pointer"
      >
        Back
      </button>
    </div>
  );
}
