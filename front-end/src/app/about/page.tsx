import React from "react";
import FloatingNavbar from "@/components/ui/floating-navbar";
import Navbar from "@/components/ui/navbar";
import FooterSection from "@/components/home/FooterSection";
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

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "Worked on the front-end and back-end of the website, helping in the design process and deployment of the website",
      name: "Jonathan Carlo",
      designation: "University Student at Binus University",
      src: "/Image/profile-picture.jpg",
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Clariant Benedictus Tan",
      designation: "University Student at Binus University",
      src: "/Image/profile-picture.jpg",
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Bren Alden",
      designation: "University Student at Binus University",
      src: "/Image/profile-picture.jpg",
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "William Yosua Montolalu",
      designation: "University Student at Binus University",
      src: "/Image/profile-picture.jpg",
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Richie Hartanto Gunawan",
      designation: "University Student at Binus University",
      src: "/Image/profile-picture.jpg",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
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
