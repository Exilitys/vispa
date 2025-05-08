import React from "react";
import FloatingNavbar from "@/components/ui/floating-navbar";
import Navbar from "@/components/ui/navbar";
import CourseGridSection from "@/components/learn/courseGridSection";
import { Suspense } from "react";
import CourseGridLoading from "@/components/learn/courseGridLoading";
import FooterSection from "@/components/home/FooterSection";

export default function Home() {
  return (
    <div className="relative  w-full">
      <Navbar />
      <FloatingNavbar />
      <Suspense fallback={<CourseGridLoading />}>
        <CourseGridSection />
      </Suspense>
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
