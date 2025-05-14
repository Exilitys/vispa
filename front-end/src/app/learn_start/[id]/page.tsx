"use client";

import { useEffect, useState } from "react";
import FloatingNavbar from "@/components/ui/floating-navbar";
import Navbar from "@/components/ui/navbar";
import VideoComponent from "@/components/ui/video-component";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/Client";

export default function LearnStart({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not logged in:", userError);
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("MsCourses")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching course:", error.message);
        setError("Failed to load course");
      } else {
        setCourse(data);
      }

      setLoading(false);
    };

    fetchData();
  }, [params.id, router, supabase]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500 font-semibold">
        Loading...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {error || "Something went wrong"}
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Navbar />
      <FloatingNavbar />
      <div className="my-12 flex flex-col justify-center items-center">
        <h3 className="text-xl text-black dark:text-white text-center md:text-left max-w-3/4">
          Learn
        </h3>
        <h2 className="text-3xl font-bold text-black dark:text-white py-5 text-center md:text-left max-w-3/4">
          {course.course_name}
        </h2>
      </div>
      <div className="flex justify-center">
        <VideoComponent src={course.video} className="w-md md:w-2xl" />
      </div>

      <Link href={`/learn_question/${params.id}`}>
        <div className="my-12 flex flex-row justify-center items-center">
          <h2 className="text-3xl font-bold text-black dark:text-white px-5 text-center md:text-left max-w-3/4">
            Next
          </h2>
          <IconArrowRight
            size={50}
            stroke={2}
            className="hover:cursor-pointer"
          />
        </div>
      </Link>
    </div>
  );
}
