import React from "react";
import FloatingNavbar from "@/components/ui/floating-navbar";
import Navbar from "@/components/ui/navbar";
import FooterSection from "@/components/home/FooterSection";
import { AnimatedTestimonialsDemo } from "@/components/ui/AnimatedTestimonialsDemo";
export default function About() {
  return (
    <div className="relative  w-full">
      <Navbar />
      <FloatingNavbar />
      <h1 className="text-3xl font-bold text-center mt-24">About Us</h1>
      <AnimatedTestimonialsDemo />
      <FooterSection />
    </div>
  );
}

// const DummyContent = () => {
//   return (
//     <div className="grid grid-cols-1 h-[40rem] w-full bg-white dark:bg-black relative border border-neutral-200 dark:border-white/[0.2] rounded-md">
//       <p className="dark:text-white text-neutral-600 text-center text-4xl mt-40 font-bold">
//         Dummy Content
//       </p>
//       <div className="inset-0 absolute bg-grid-black/[0.1] dark:bg-grid-white/[0.2]" />
//     </div>
//   );
// };
