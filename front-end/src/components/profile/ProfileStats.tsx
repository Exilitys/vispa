"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { BarChart2, BookOpen, Flame, Star } from "lucide-react";
import { createClient } from "../../../utils/supabase/Client";
const supabase = createClient();

export default function ProfileStats() {
  const [stats, setStats] = useState({
    completed_lessons: 0,
    total_lessons: 0,
    signs_learned: 0,
    total_signs: 16,
    score: 0,
    streak_days: 0,
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      // 1) Get authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) return console.error("Auth error:", userError);

      // 2) Load the MsUser row
      const { data: userRow, error: userRowError } = await supabase
        .from("MsUser")
        .select("*")
        .eq("uuid", user.id)
        .single();
      if (userRowError) return console.error("Fetch user error:", userRowError);

      // 3) Count all courses for the progress bar
      const { count: courseCount } = await supabase
        .from("MsCourses")
        .select("*", { count: "exact", head: true });

      // 4) Set stats only (not completed courses)
      setStats({
        completed_lessons: Array.isArray(userRow.completed_lessons)
          ? userRow.completed_lessons.length
          : 0,
        total_lessons: courseCount ?? 0,
        signs_learned: Array.isArray(userRow.signs_learned)
          ? userRow.signs_learned.length
          : 0,
        total_signs: 16,
        score: userRow.score ?? 0,
        streak_days: userRow.streak_days ?? 0,
      });
    };

    fetchUserStats();
  }, []);

  const percent = stats.total_lessons
    ? ((stats.completed_lessons / stats.total_lessons) * 100).toFixed(0)
    : "0";

  return (
    <section className="max-w-4xl w-full px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-2 text-blue-600 font-medium mb-6">
        <BarChart2 className="w-5 h-5" />
        <span>Learning Stats</span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-row-2 gap-3 md:w-xl">
        {/* Learning Stats Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 className="font-semibold text-lg md:text-xl">
            Your Learning Stats
          </h2>

          {/* Completed Lessons */}
          <div className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Completed Lessons</span>
              </div>
              <span className="font-semibold">
                {stats.completed_lessons}/{stats.total_lessons}
              </span>
            </div>
            <Progress value={Number(percent)} className="h-2 rounded" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {percent}% complete
            </p>
          </div>

          {/* Score Earned */}
          <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Score Earned</span>
            </div>
            <span className="font-semibold">{stats.score} pts</span>
          </div>
        </div>

        {/* Current Streak Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl   p-6 flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
            <Flame className="w-4 h-4 text-purple-600" />
            <span>Current Streak</span>
          </div>
          <p className="text-purple-600 text-2xl font-bold">
            {stats.streak_days} days
          </p>
        </div>
      </div>
    </section>
  );
}
