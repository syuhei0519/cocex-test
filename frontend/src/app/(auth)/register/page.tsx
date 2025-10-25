"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ApiError } from "@/lib/http/client";
import { useRegisterMutation } from "@/lib/queries/auth";
import { routes } from "@/lib/router/paths";

type FormState = "form" | "completed";

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [state, setState] = useState<FormState>("form");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    try {
      await registerMutation.mutateAsync({ name, email, password });
      setState("completed");
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setFormError("このメールアドレスはすでに登録済みです。ログインをお試しください。");
        return;
      }

      if (error instanceof ApiError && error.status === 400) {
        setFormError("入力内容に不備があります。再度ご確認ください。");
        return;
      }

      setFormError("登録に失敗しました。時間をおいて再度お試しください。");
    }
  };

  if (state === "completed") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">仮登録が完了しました</h1>
          <p className="mt-4 text-sm text-zinc-500">
            登録確認メールを送信しました。メール内のリンクからメールアドレスの確認を完了してください。
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Button onClick={() => router.push(routes.auth.login)}>ログイン画面へ戻る</Button>
            <Link href={routes.home} className="text-sm text-zinc-500 hover:text-zinc-900">
              トップページへ戻る
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-200 to-white px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <Link href={routes.home} className="text-sm font-semibold text-zinc-900">
            Household Budget
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-zinc-900">アカウント登録</h1>
          <p className="mt-2 text-sm text-zinc-500">予算管理を始めるために必要な情報を入力してください。</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
              お名前
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
            />
          </div>
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
            />
            <p className="mt-1 text-xs text-zinc-400">8文字以上のパスワードをご入力ください。</p>
          </div>
          {formError ? <p className="text-sm text-red-500">{formError}</p> : null}
          <Button
            type="submit"
            disabled={registerMutation.status === "pending"}
            className="flex w-full items-center justify-center gap-2"
          >
            {registerMutation.status === "pending" ? <Spinner className="h-4 w-4 border-2" /> : null}
            登録する
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-zinc-500">
          すでにアカウントをお持ちの方は{" "}
          <Link href={routes.auth.login} className="text-zinc-900 underline">
            ログインはこちら
          </Link>
        </p>
      </div>
    </main>
  );
}
