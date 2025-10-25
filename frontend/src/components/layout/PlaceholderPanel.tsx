import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const PlaceholderPanel = ({ children }: Props) => {
  return (
    <div className="rounded-lg border border-dashed border-zinc-200 bg-white p-6 text-sm text-zinc-500">
      {children}
    </div>
  );
};
