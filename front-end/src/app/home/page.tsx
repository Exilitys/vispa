import React from "react";
import FloatingNavbar from "@/components/ui/floating-navbar";
import ContinueCourseSection from "@/components/home/ContinueCourseSection";
import Navbar from "@/components/ui/navbar";
import ProgressSection from "@/components/home/ProgressSection";
import HeroSection from "@/components/home/HeroSection";
import PracticeSection from "@/components/home/PracticeSection";
import FooterSection from "@/components/home/FooterSection";
export default function Home() {
  return (
    <div className="relative  w-full">
      <Navbar />
      <FloatingNavbar />
      <HeroSection />
      <div className="flex flex-col gap-20 mt-24  justify-center items-center">
        <ProgressSection />
        <ContinueCourseSection />
        <PracticeSection />
      </div>
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
