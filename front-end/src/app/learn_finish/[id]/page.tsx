import { createClient } from "../../../../utils/supabase/Client";
import { addCourseCompletion } from "./action";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic"; // ensure SSR on every request

export default async function CourseCompletionPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const supabase = createClient();

  const { data: course, error } = await supabase
    .from("MsCourses")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !course) {
    console.error("Error fetching course:", error?.message);
    redirect("/error");
  }

  // ✅ Run this during page rendering (server-side)
  await addCourseCompletion(course.id, course.points);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50 px-4 text-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full space-y-6">
        <h2 className="text-gray-700 text-xl font-medium">
          🎉 Congratulations!
        </h2>
        <p className="text-gray-800 text-lg">
          You have successfully completed the course
        </p>
        <h1 className="text-4xl font-bold text-black">{course.course_name}</h1>
        <p className="text-green-600 font-semibold text-lg">
          {course.points} points added to your profile
        </p>
        <Button
          size="xl"
          className="mx-auto bg-blue-500 text-white py-3 rounded-lg transition-all hover:bg-blue-600 hover:cursor-pointer"
          asChild
        >
          <Link href="/home" className="text-2xl">
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
