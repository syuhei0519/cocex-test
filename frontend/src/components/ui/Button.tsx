import type { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export const Button = ({ variant = "primary", className, children, ...rest }: Props) => {
  const variantClass =
    variant === "primary"
      ? "bg-black text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
      : "bg-white text-black border border-zinc-300 hover:bg-zinc-100 dark:bg-black dark:text-white dark:border-zinc-600 dark:hover:bg-zinc-900";

  return (
    <button
      type="button"
      className={twMerge(
        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
        variantClass,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
