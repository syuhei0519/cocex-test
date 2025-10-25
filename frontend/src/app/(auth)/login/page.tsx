"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ApiError } from "@/lib/http/client";
import { authKeys, useLoginMutation } from "@/lib/queries/auth";
import { routes } from "@/lib/router/paths";

const ensureRedirectPath = (value: string | null) => {
  if (!value) return routes.app.dashboard;
  return value.startsWith("/") ? value : routes.app.dashboard;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    try {
      await loginMutation.mutateAsync({ email, password });
      await queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
      const redirectTo = ensureRedirectPath(searchParams.get("redirect"));
      router.replace(redirectTo);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setFormError("メールアドレスまたはパスワードが正しくありません。");
        return;
      }
      setFormError("ログインに失敗しました。時間をおいて再度お試しください。");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <Link href={routes.home} className="text-sm font-semibold text-zinc-900">
            Household Budget
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-zinc-900">ログイン</h1>
          <p className="mt-2 text-sm text-zinc-500">登録済みのメールアドレスとパスワードでサインインします。</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
            />
          </div>
          {formError ? <p className="text-sm text-red-500">{formError}</p> : null}
          <Button
            type="submit"
            disabled={loginMutation.status === "pending"}
            className="flex w-full items-center justify-center gap-2"
          >
            {loginMutation.status === "pending" ? <Spinner className="h-4 w-4 border-2" /> : null}
            サインイン
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-zinc-500">
          パスワードをお忘れの場合は管理者にお問い合わせください。
        </p>
      </div>
    </main>
  );
}
