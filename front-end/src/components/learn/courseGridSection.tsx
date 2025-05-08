import { BentoGridItem } from "../ui/bento-grid";
import { IconClockHour1 } from "@tabler/icons-react";
import { IconBook } from "@tabler/icons-react";
import { createClient } from "../../../utils/supabase/Client";

export const dynamic = "force-dynamic"; // if you want fresh SSR every time

export default async function CourseGridSection() {
  const supabase = createClient();
  const { data: courses, error } = await supabase
    .from("MsCourses")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching courses:", error.message);
    return <p>Failed to load courses.</p>;
  }

  return (
    <div className="my-12 flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold text-black dark:text-white my-5 text-center md:text-left max-w-3/4">
        Courses
      </h2>
      <div className="mx-auto grid max-w-3/4 grid-cols-1 gap-6  md:grid-cols-3  my-12">
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
      : "text-gray-500"; // fallback if unknown

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
