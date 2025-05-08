"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VideoComponent from "@/components/ui/video-component";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";

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

export default function QuizClient({
  questions,
  courseId,
}: {
  questions: Question[];
  courseId: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const router = useRouter();

  const current = questions[questionIndex];

  const handleCheckAnswer = () => {
    if (selected !== null) {
      setAnswered(true);
      setIsCorrect(selected === current.correct);
    }
  };

  const handleNextQuestion = () => {
    if (isCorrect && questionIndex >= questions.length - 1) {
      setFinished(true);
    } else if (isCorrect) {
      setQuestionIndex((prev) => prev + 1);
      setSelected(null);
      setAnswered(false);
      setIsCorrect(null);
    }
  };

  useEffect(() => {
    if (finished) router.push(`/learn_finish/${courseId}`);
  }, [finished]);

  return (
    <div className="relative w-full flex items-center justify-center h-screen">
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-black dark:text-white mt-10 text-center">
          {current?.MsCourses?.course_name}
        </h2>

        <main className="flex items-center mt-10 justify-center bg-gray-50 p-4">
          <div className="flex justify-center flex-col md:flex-row bg-white shadow-lg rounded-lg p-6 max-w-7xl gap-6">
            <div className="flex justify-center">
              <VideoComponent src={current?.video} className="w-md md:w-xl" />
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">{current?.title}</h2>

              <div className="space-y-3">
                {current?.options.option.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  return (
                    <button
                      key={option}
                      onClick={() => {
                        setSelected(option);
                        setIsCorrect(null);
                        setAnswered(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all
                      ${
                        selected === option
                          ? "bg-blue-100 border-blue-500 text-blue-800 font-semibold"
                          : "bg-gray-100 hover:bg-gray-200 border-gray-200"
                      }
                      ${
                        selected === option && isCorrect === false
                          ? "bg-red-100 border-red-500 text-red-800"
                          : ""
                      }
                      ${
                        selected === option && isCorrect === true
                          ? "bg-green-100 border-green-500 text-green-800"
                          : ""
                      }
                    `}
                    >
                      <span className="font-medium mr-2">{letter}.</span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="mt-4 text-center">
                  {isCorrect ? (
                    <div className="text-green-600 font-semibold">
                      Correct! 🎉
                      <p className="mt-2 text-sm text-gray-600">
                        {selected} is the correct answer
                      </p>
                    </div>
                  ) : (
                    <div className="text-red-600 font-semibold">
                      Incorrect! 😞
                      <p className="mt-2 text-sm text-gray-600">
                        {selected} is not the correct answer
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        <div className="flex flex-row gap-8 mt-10">
          <Button
            onClick={handleCheckAnswer}
            size="xl"
            className="mx-auto  bg-blue-500 text-white py-3 rounded-lg transition-all hover:bg-blue-600 hover:cursor-pointer"
            asChild
          >
            <p className="text-2xl">Sumbit</p>
          </Button>
          {answered && isCorrect && (
            <Button
              onClick={handleNextQuestion}
              size="xl"
              className="mx-auto  bg-blue-500 text-white py-3 rounded-lg transition-all hover:bg-blue-600 hover:cursor-pointer"
              asChild
            >
              <p className="text-2xl">
                Next{" "}
                <IconArrowRight className="size-[25px]" size={50} stroke={2} />
              </p>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
