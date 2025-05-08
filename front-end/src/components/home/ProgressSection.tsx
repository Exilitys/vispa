"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "../../../utils/supabase/Client";

const supabase = await createClient();

const ProgressSection = () => {
  const [stats, setStats] = useState({
    streak_days: 0,
    signs_learned: 0,
    completed_lessons: 0,
    score: 0,
  });

  useEffect(() => {
    const fetchProgress = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error getting user:", userError);
        return;
      }

      const { data, error } = await supabase
        .from("MsUser")
        .select("streak_days, signs_learned, completed_lessons, score")
        .eq("uuid", user.id)
        .single();

      if (error) {
        console.error("Error fetching progress:", error);
        return;
      }

      setStats({
        streak_days: data.streak_days ?? 0,
        signs_learned: Array.isArray(data.signs_learned)
          ? data.signs_learned.length
          : 0,
        completed_lessons: Array.isArray(data.completed_lessons)
          ? data.completed_lessons.length
          : 0,
        score: data.score ?? 0,
      });
    };

    fetchProgress();
  }, []);

  return (
    <div className="max-w-6xl py-6 flex flex-col md:flex-row md:items-center md:justify-evenly">
      <div className="mb-4 md:mb-0 text-left md:text-left pr-5">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Your Progress
        </h2>
        <p className="text-sm text-gray-500">Keep up the great work!</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-3xl  font-bold text-purple-600"></p>
          <p className="text-md text-purple-600 dark:text-gray-300"></p>
        </div>
        <div>
          <p className="text-3xl  font-bold text-purple-600">
            {stats.streak_days}
          </p>
          <p className="text-md text-purple-600 dark:text-gray-300">
            Day Streak
          </p>
        </div>

        <div>
          <p className="text-xl font-semibold text-blue-600">
            {stats.completed_lessons}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Lessons Completed
          </p>
        </div>

        <div>
          <p className="text-xl font-semibold text-blue-600">{stats.score}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Total Score
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressSection;
