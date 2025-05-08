"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { BarChart2, BookOpen, Flame, Star } from "lucide-react";
import { createClient } from "../../../utils/supabase/Client";
const supabase = createClient();

export default function ProfileStats() {
  const [stats, setStats] = useState({
    completed_lessons: 0,
    total_lessons: 8,
    signs_learned: 0,
    total_signs: 16,
    score: 0,
    streak_days: 0,
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Failed to get user:", userError);
        return;
      }

      const { data, error } = await supabase
        .from("MsUser")
        .select("*")
        .eq("uuid", user.id)
        .single();

      if (error) {
        console.error("Error fetching user stats:", error);
        return;
      }

      const { count } = await supabase
        .from("MsCourses")
        .select("*", { count: "exact", head: true });

      console.log(data);
      console.log(count);

      setStats({
        completed_lessons: Array.isArray(data?.completed_lessons)
          ? data.completed_lessons.length
          : 0,
        total_lessons: count ?? 8,
        signs_learned: Array.isArray(data?.signs_learned)
          ? data.signs_learned.length
          : 0,
        total_signs: 16,
        score: data.score ?? 0,
        streak_days: data.streak_days ?? 0,
      });
    };

    fetchUserStats();
  }, [supabase]);

  return (
    <section className="p-6 w-md md:w-xl lg:w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-blue-600 font-medium">
          <BarChart2 className="w-5 h-5" />
          <span>Learning Stats</span>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 space-y-4 border border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-lg">Your Learning Stats</h2>

          {/* Completed Lessons */}
          <div>
            <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 mb-1">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Completed Lessons</span>
              </div>
              <span className="font-semibold">
                {stats.completed_lessons}/{stats.total_lessons}
              </span>
            </div>
            <Progress
              value={(stats.completed_lessons / stats.total_lessons) * 100}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {((stats.completed_lessons / stats.total_lessons) * 100).toFixed(
                0
              )}
              %
            </span>
          </div>

          {/* Score Earned */}
          <div>
            <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Score Earned</span>
              </div>
              <span className="font-semibold">{stats.score} pts</span>
            </div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="flex items-center justify-between text-sm font-medium">
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <Flame className="w-4 h-4 text-purple-600" />
            <span>Current Streak</span>
          </div>
          <span className="text-purple-600 text-lg font-bold">
            {stats.streak_days} days
          </span>
        </div>
      </div>
    </section>
  );
}
