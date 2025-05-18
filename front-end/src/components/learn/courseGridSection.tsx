"use client";

import { useEffect, useState } from "react";
import { BentoGridItem } from "../ui/bento-grid";
import { IconClockHour1, IconBook } from "@tabler/icons-react";
import { createClient } from "../../../utils/supabase/Client";
import { Input } from "../ui/input";

const supabase = createClient();

export interface Course {
  id: number;
  course_name: string;
  description: string;
  dificulty: string;
  length: number;
  image?: string;
}

export default function CourseGridSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("MsCourses")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching courses:", error.message);
        setCourses([]);
      } else {
        setCourses(data || []);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter((course) =>
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  return (
    <div className="my-12 flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold text-black dark:text-white my-5 text-center md:text-left max-w-3/4">
        Courses
      </h2>

      <Input
        type="text"
        className="w-3xl bg-zinc-100"
        placeholder="Search courses by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <div className="mx-auto grid max-w-3/4 grid-cols-1 gap-6 md:grid-cols-3 my-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
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
            ))
          ) : (
            <p className="col-span-full text-gray-500">No courses found.</p>
          )}
        </div>
      )}
    </div>
  );
}

const Skeleton = ({ src }: { src?: string; alt?: string }) => {
  return src ? (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
      <img src={src} width="1024" height="auto" className="object-cover" />
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
