import { createClient } from "../../../../utils/supabase/Client";
const supabase = createClient();
import QuizClient from "@/components/learn/quizclient";
interface Question {
  id: number;
  title: string;
  course_id: number;
  options: { option: string[] };
  correct: string;
  video: string;
  MsCourses: {
    course_name: string;
  };
}
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { data: questions } = await supabase
    .from("Questions")
    .select("*, MsCourses(course_name)")
    .eq("course_id", params.id);

  return (
    <QuizClient questions={questions as Question[]} courseId={params.id} />
  );
}
