"use client";

import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
};

export const Spinner = ({ className, size = "md" }: Props) => {
  return (
    <span
      className={twMerge(
        "inline-block animate-spin rounded-full border-solid border-zinc-300 border-t-black dark:border-zinc-700 dark:border-t-zinc-200",
        sizeMap[size],
        className,
      )}
      aria-hidden="true"
    />
  );
};
