import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="py-10 px-6 md:px-10 flex">
      {/* Left Side - Text */}
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Learn Indonesian Sign Language the Fun Way
          </h1>
          <p className="text-gray-600 mb-6">
            Learn sign language through interactive lessons, real-time feedback,
            and engaging challenges
          </p>
          <Button size="lg" asChild>
            <Link href="/learn">Start Learning Now</Link>
          </Button>
        </div>

        {/* Right side - Image */}
        <div className="w-full md:w-[450px]">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/Image/hands.jpg"
              alt="Illustration of hands signing"
              width={300}
              height={300}
              className="object-cover w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
