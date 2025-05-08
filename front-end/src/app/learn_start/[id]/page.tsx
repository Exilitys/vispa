import FloatingNavbar from "@/components/ui/floating-navbar";
import Navbar from "@/components/ui/navbar";
import VideoComponent from "@/components/ui/video-component";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/Client";
const supabase = createClient();

export default async function DriveVideoPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { data: course, error } = await supabase
    .from("MsCourses")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    console.error("Error fetching course:", error.message);
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        Failed to load course
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
      <div className="flex justify-center ">
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
