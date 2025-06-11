"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "../../../utils/supabase/Client";
import { BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconClockHour1,
  IconBook,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
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
      if (rowErr || !userRow) return setError("Couldn&apos;t load your record");

      if (
        Array.isArray(userRow.completed_lessons) &&
        userRow.completed_lessons.length
      ) {
        const { data, error: courseErr } = await supabase
          .from("MsCourses")
          .select("id, course_name, description, image, dificulty, length")
          .in("id", userRow.completed_lessons as number[]);
        if (courseErr) return setError("Couldn&apos;t load courses");
        setCourses(data || []);
      }

      setLoading(false);
    };
    load();
  }, [supabase]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const diffColor = (d: string) =>
    d.toLowerCase() === "easy"
      ? "text-green-500"
      : d.toLowerCase() === "medium"
      ? "text-yellow-500"
      : "text-red-500";

  if (loading) return <p className="text-center">Loading completed courses…</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!courses.length)
    return (
      <p className="text-center text-gray-500">
        You haven&apos;t completed any courses yet.
      </p>
    );

  return (
    <div className={cn(className)}>
      <h2 className="text-2xl font-bold text-black dark:text-white max-w-4xl mx-auto my-5 text-center md:text-left">
        Courses Completed
      </h2>

      {/* Arrows on larger screens; stack vertically on mobile */}
      <div className="flex items-center justify-center md:gap-4 max-w-7xl mx-auto px-4">
        {/* Left Arrow */}
        <button
          className="hidden sm:inline-flex bg-white p-2 shadow rounded-full shrink-0"
          onClick={() => scroll("left")}
        >
          <IconChevronLeft />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 pointer-events-auto w-full no-scrollbar scroll-smooth"
        >
          {courses.map((c) => (
            <div
              key={c.id}
              className="min-w-[220px] sm:min-w-[260px] md:min-w-[280px] max-w-[300px] flex-shrink-0 pointer-events-auto"
            >
              <BentoGridItem
                links={`/learn_start/${c.id}`}
                header={
                  c.image ? (
                    <div className="flex-1 w-full h-32 sm:h-36 md:h-40 rounded-xl overflow-hidden">
                      <img
                        src={c.image}
                        className="object-cover w-full h-full"
                        alt={c.course_name}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 w-full h-32 sm:h-36 md:h-40 rounded-xl bg-neutral-200 animate-pulse" />
                  )
                }
                title={c.course_name}
                description={
                  <div className="text-xs sm:text-sm space-y-2 sm:space-y-3">
                    <div>{c.description}</div>
                    <div className="flex items-center space-x-2">
                      <IconBook className="w-4 h-4" />
                      <span className={diffColor(c.dificulty)}>
                        {c.dificulty}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IconClockHour1 className="w-4 h-4" />
                      <span>{c.length} minutes</span>
                    </div>
                  </div>
                }
                className="h-fit"
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="hidden sm:inline-flex bg-white p-2 shadow rounded-full shrink-0"
          onClick={() => scroll("right")}
        >
          <IconChevronRight />
        </button>
      </div>
    </div>
  );
}
