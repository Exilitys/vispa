"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../utils/supabase/Client";
import { BentoGridItem } from "../ui/bento-grid";
import { cn } from "@/lib/utils";
import { IconClockHour1, IconBook } from "@tabler/icons-react";

interface ContinueCourseSectionProps {
  className?: string;
}

interface Course {
  id: number;
  course_name: string;
  description: string;
  image?: string;
  dificulty: string;
  length: number;
}

export default function ContinueCourseSection({
  className,
}: ContinueCourseSectionProps) {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchCourses = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) return setError("Auth error");

      const { data: userRow, error: userRowError } = await supabase
        .from("MsUser")
        .select("*")
        .eq("uuid", user.id)
        .single();
      if (userRowError || !userRow) return setError("User fetch error");

      const completedCourses = userRow.completed_lessons || [];
      console.log("Completed courses:", userRow);

      const { data: courses, error: coursesError } = await supabase
        .from("MsCourses")
        .select("id, course_name, description, image, dificulty, length")
        .not("id", "in", `(${completedCourses.join(",")})`)
        .limit(3);

      if (coursesError) return setError("Course fetch error");

      setCourses(courses);
      setLoading(false);
    };

    fetchCourses();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className={cn(className)}>
      <h2 className="text-2xl font-bold text-black dark:text-white max-w-4xl mx-auto my-5 text-center md:text-left">
        Explore new courses
      </h2>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:auto-rows-[18rem] md:grid-cols-3 my-12">
        {courses?.map((course) => (
          <BentoGridItem
            key={course.id}
            title={course.course_name}
            description={CourseDescription({
              description: course.description,
              difficulty: course.dificulty,
              length: `${course.length} minutes`,
            })}
            header={<Skeleton src={course.image} />}
            links={`/learn_start/${course.id}`}
            className="h-fit"
          />
        ))}
      </div>
    </div>
  );
}

const Skeleton = ({ src }: { src?: string; alt?: string }) => {
  return src ? (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
      <img src={src} width="1024" height="auto" />
    </div>
  ) : (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 animate-pulse" />
  );
};

const CourseDescription = ({
  description,
  difficulty,
  length,
}: {
  description: string;
  difficulty: string;
  length: string;
}) => {
  const difficultyColor =
    difficulty.toLowerCase() === "easy"
      ? "text-green-500"
      : difficulty.toLowerCase() === "medium"
      ? "text-yellow-500"
      : difficulty.toLowerCase() === "hard"
      ? "text-red-500"
      : "text-gray-500";

  return (
    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-4">
      <div>{description}</div>
      <div className="flex items-center space-x-2">
        <IconBook />
        <span className={difficultyColor}> {difficulty}</span>
      </div>
      <div className="flex items-center space-x-2">
        <IconClockHour1 /> <span>{length}</span>
      </div>
    </div>
  );
};
