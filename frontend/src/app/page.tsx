import { routes } from "@/lib/router/paths";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-12 px-6 py-24 text-center md:px-16">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Household Budget</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            収支の見える化を、チームで進める家計管理アプリ
          </h1>
          <p className="mx-auto max-w-2xl text-base text-zinc-300 md:text-lg">
            ダッシュボードで毎月の予算と実績を把握し、カテゴリ別の分析やレポート出力をスムーズに行えます。
            今日の取引登録から長期的な振り返りまで、ワークフローをつなぐ基盤を提供します。
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <a
            href={routes.auth.login}
            className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            ログインしてはじめる
          </a>
          <a
            href="#features"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            機能概要を見る
          </a>
        </div>
        <section
          id="features"
          className="grid w-full gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-left md:grid-cols-3"
        >
          {[
            {
              title: "リアルタイム集計",
              description: "React Query によるキャッシュと同期で、API の結果を即座に画面へ反映。",
            },
            {
              title: "柔軟なルーティング",
              description: "Next.js App Router を活用したセクション別の UI とガード制御。",
            },
            {
              title: "拡張性あるドメイン",
              description: "予算・取引・レポートの各ページをプラガブルに追加できます。",
            },
          ].map((feature) => (
            <article key={feature.title} className="rounded-2xl bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">{feature.title}</h2>
              <p className="mt-3 text-sm text-zinc-300">{feature.description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
