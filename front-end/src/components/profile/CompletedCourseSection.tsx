"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../utils/supabase/Client";
import { BentoGridItem } from "@/components/ui/bento-grid";
import { IconClockHour1, IconBook } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface Course {
  id: number;
  course_name: string;
  description: string;
  image?: string;
  dificulty: string;
  length: number;
}

export default function CompletedCourseSection({
  className,
}: {
  className?: string;
}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr || !user) return setError("Not signed in");

      const { data: userRow, error: rowErr } = await supabase
        .from("MsUser")
        .select("completed_lessons")
        .eq("uuid", user.id)
        .single();
      if (rowErr || !userRow) return setError("Couldn’t load your record");

      if (
        Array.isArray(userRow.completed_lessons) &&
        userRow.completed_lessons.length
      ) {
        const { data, error: courseErr } = await supabase
          .from("MsCourses")
          .select("id, course_name, description, image, dificulty, length")
          .in("id", userRow.completed_lessons as number[]);
        if (courseErr) return setError("Couldn’t load courses");
        setCourses(data || []);
      }

      setLoading(false);
    };
    load();
  }, [supabase]);

  if (loading) return <p className="text-center">Loading completed courses…</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!courses.length)
    return (
      <p className="text-center text-gray-500">
        You haven’t completed any courses yet.
      </p>
    );

  const diffColor = (d: string) =>
    d.toLowerCase() === "easy"
      ? "text-green-500"
      : d.toLowerCase() === "medium"
      ? "text-yellow-500"
      : "text-red-500";

  return (
    <div className={cn(className)}>
      <h2 className="text-2xl font-bold text-black dark:text-white max-w-4xl mx-auto my-5 text-center md:text-left">
        Courses Completed
      </h2>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 my-12 md:auto-rows-[18rem] md:grid-cols-3">
        {courses.map((c) => (
          <BentoGridItem
            key={c.id}
            links={`/learn_start/${c.id}`}
            header={
              c.image ? (
                <div className="flex-1 w-full h-full rounded-xl overflow-hidden">
                  <img src={c.image} className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="flex-1 w-full h-full rounded-xl bg-neutral-200 animate-pulse" />
              )
            }
            title={c.course_name}
            description={
              <div className="text-sm space-y-3">
                <div>{c.description}</div>
                <div className="flex items-center space-x-2">
                  <IconBook />{" "}
                  <span className={diffColor(c.dificulty)}>{c.dificulty}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <IconClockHour1 /> <span>{c.length} minutes</span>
                </div>
              </div>
            }
            className="h-fit"
          />
        ))}
      </div>
    </div>
  );
}
