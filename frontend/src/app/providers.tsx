"use client";

import { QueryClient, type QueryClientConfig, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  config?: QueryClientConfig;
};

export const AppQueryProvider = ({ children, config }: Props) => {
  const [client] = useState(() => new QueryClient(config));

  useEffect(() => {
    const initAxe = async () => {
      if (process.env.NODE_ENV !== "development" || typeof window === "undefined") {
        return;
      }

      const [{ default: axe }, { default: ReactDOM }] = await Promise.all([
        import("@axe-core/react"),
        import("react-dom"),
      ]);
      axe(React, ReactDOM, 1000);
    };

    void initAxe();
  }, []);

  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV !== "production" ? <ReactQueryDevtools /> : null}
    </QueryClientProvider>
  );
};
