"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";

import { useCurrentUser } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/Button";
import { authKeys, useLogoutMutation } from "@/lib/queries/auth";
import { routes } from "@/lib/router/paths";

type NavItem = {
  label: string;
  href: string;
  exact?: boolean;
};

const navItems: NavItem[] = [
  { label: "ダッシュボード", href: routes.app.dashboard, exact: true },
  { label: "取引", href: routes.app.transactions },
  { label: "口座", href: routes.app.accounts },
  { label: "カテゴリ", href: routes.app.categories },
  { label: "予算", href: routes.app.budgets },
  { label: "レポート", href: routes.app.reports },
  { label: "設定", href: routes.app.settings },
];

type AppShellProps = {
  children: ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  const pathname = usePathname();
  const currentUser = useCurrentUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutMutation = useLogoutMutation();
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLogoutError(null);

    try {
      await logoutMutation.mutateAsync();
      queryClient.removeQueries({ queryKey: authKeys.all });
      router.replace(routes.auth.login);
    } catch {
      setLogoutError("ログアウトに失敗しました。時間をおいて再度お試しください。");
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <aside className="hidden w-64 flex-col border-r border-zinc-200 bg-white md:flex">
        <div className="px-6 pt-8">
          <Link href={routes.app.dashboard} className="text-lg font-semibold text-zinc-900">
            Household Budget
          </Link>
          <p className="mt-2 text-sm text-zinc-500">{currentUser.name ?? "ログインユーザー"}</p>
        </div>
        <nav className="mt-8 flex-1 space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={twMerge(
                  "flex items-center rounded-md px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                  isActive && "bg-zinc-900 text-white hover:bg-zinc-900 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-6 pb-6">
          <Button
            variant="secondary"
            onClick={handleLogout}
            disabled={logoutMutation.status === "pending"}
            className="flex w-full items-center justify-center gap-2"
          >
            {logoutMutation.status === "pending" ? "ログアウト中..." : "ログアウト"}
          </Button>
          {logoutError ? <p className="mt-2 text-xs text-red-500">{logoutError}</p> : null}
          <p className="mt-4 text-xs text-zinc-400">{new Date().getFullYear()} © Household Budget</p>
        </div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-4 shadow-sm md:hidden">
          <Link href={routes.app.dashboard} className="text-base font-semibold text-zinc-900">
            Household Budget
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">{currentUser.name}</span>
            <Button
              variant="secondary"
              onClick={handleLogout}
              disabled={logoutMutation.status === "pending"}
              className="flex items-center gap-1 px-3 py-1 text-xs"
            >
              {logoutMutation.status === "pending" ? "..." : "ログアウト"}
            </Button>
          </div>
        </header>
        <nav className="border-b border-zinc-200 bg-white px-4 py-2 md:hidden">
          <ul className="flex gap-3 overflow-x-auto text-sm">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={twMerge(
                      "rounded-full px-3 py-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
                      isActive && "bg-zinc-900 text-white hover:bg-zinc-900",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {logoutError ? <p className="mt-2 text-xs text-red-500">{logoutError}</p> : null}
        </nav>
        <main className="flex-1">
          <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
