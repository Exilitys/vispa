import { cn } from "@/lib/utils";
import { Button } from "./button";
import Link from "next/link";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl  grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3 ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  links,
  completed,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  links?: string;
  completed?: boolean;
}) => {
  return (
    <div
      className={cn(
        "group/bento mx-auto max-w-[18rem] md:max-w-7xl shadow-input row-span-1 flex flex-col justify-between  rounded-xl border border-neutral-200 bg-white p-4 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
        className
      )}
    >
      <div>{header}</div>
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        <div
          className={`mt-4 mb-4 font-sans text-xl font-bold text-neutral-600 dark:text-neutral-200 `}
        >
          <p className={`${completed && "text-green-700"}`}>
            {title}
            {completed && <span className="text-green-500 pl-2">✓</span>}
          </p>
        </div>
        <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
          {description}
        </div>
        <div className="text-right pt-5">
          <Button asChild>
            <Link href={links!}>Continue</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
