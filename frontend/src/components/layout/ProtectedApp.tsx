"use client";

import type { ReactNode } from "react";

import { AuthGuard } from "@/components/auth/AuthGuard";

import { AppShell } from "./AppShell";

type Props = {
  children: ReactNode;
};

export const ProtectedApp = ({ children }: Props) => {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
};
