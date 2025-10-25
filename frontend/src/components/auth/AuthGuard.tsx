"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useCurrentUserQuery, type CurrentUserResponse } from "@/lib/queries/auth";
import { routes } from "@/lib/router/paths";

import { LoadingScreen } from "../ui/LoadingScreen";

type CurrentUserContextValue = {
  user: CurrentUserResponse;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);

  if (context === null) {
    throw new Error("useCurrentUser must be used within an AuthGuard");
  }

  return context.user;
};

type AuthGuardProps = {
  children: ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [hasNavigated, setHasNavigated] = useState(false);

  const {
    data: user,
    status,
    isError,
  } = useCurrentUserQuery({
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (status !== "pending" && (!user || isError) && !hasNavigated) {
      const redirectTo = `${routes.auth.login}?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirectTo);
      setHasNavigated(true);
    }
  }, [status, user, isError, router, pathname, hasNavigated]);

  if (status === "pending") {
    return <LoadingScreen message="セッションを確認しています..." />;
  }

  if (!user) {
    return null;
  }

  const value = useMemo<CurrentUserContextValue>(() => ({ user }), [user]);

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
};
