import type { ReactNode } from "react";

import { ProtectedApp } from "@/components/layout/ProtectedApp";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <ProtectedApp>{children}</ProtectedApp>;
}
