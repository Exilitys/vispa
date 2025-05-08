import React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

export default function PracticeSection() {
  return (
    <>
      <div className="my-24 mx-auto max-w-4xl">
        <h2 className="text-2xl font-bold text-black dark:text-white max-w-4xl mx-auto my-5 text-center md:text-left">
          Practice & Challenges
        </h2>
        <div className="flex flex-col mx-auto gap-12 md:flex-row">
          {items.map((item, i) => (
            <Card className="w-[380px]" key={i}>
              <CardHeader>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={item.links}>{item.buttonDescription}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
// const Skeleton = () => (
//   <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
// );
const items = [
  {
    title: "Real-time Practice",
    description: "Practice signs with AI-powered feedback",
    buttonDescription: "Start Practice",
    links: "/play",
  },
  {
    title: "Daily Challenge",
    description: "Complete today’s challenge to earn rewards",
    buttonDescription: "Take Challenge",
    links: "/play",
  },
];
