"use client";

import type { ReactNode } from "react";

import { Spinner } from "./Spinner";

type LoadingScreenProps = {
  message?: ReactNode;
};

export const LoadingScreen = ({ message = "読み込み中です..." }: LoadingScreenProps) => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center text-sm text-zinc-500">
      <Spinner size="lg" />
      <div>{message}</div>
    </div>
  );
};
