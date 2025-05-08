"use server";
import { createClient } from "../../../../utils/supabase/Server";

export async function addCourseCompletion(courseId: number, points: number) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await (await supabase).auth.getUser();

  if (userError || !user) {
    console.error("User not found:", userError?.message);
    return;
  }

  const { data: userData, error: fetchError } = await (await supabase)
    .from("MsUser")
    .select("completed_lessons, score")
    .eq("uuid", user.id)
    .single();

  if (fetchError) {
    console.error("Fetch user error:", fetchError.message);
    return;
  }

  const currentCourses = userData.completed_lessons || [];

  // ✅ Prevent re-completion: check if course is already completed
  if (currentCourses.includes(courseId)) {
    console.log(`Course ID ${courseId} already completed by user.`);
    return;
  }

  // Only add if not already present
  const updatedCourses = Array.isArray(currentCourses)
    ? [...new Set([...currentCourses, courseId])]
    : [courseId];

  const updatedPoints = (userData.score || 0) + points;

  const { error: updateError } = await (await supabase)
    .from("MsUser")
    .update({ completed_lessons: updatedCourses, score: updatedPoints })
    .eq("uuid", user.id);

  if (updateError) {
    console.error("Update user error:", updateError.message);
  }

  console.log("Finished");
}
