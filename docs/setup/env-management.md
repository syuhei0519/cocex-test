# フロントエンド環境変数の管理方針

## 1. 基本ルール
- Next.js のブラウザ公開変数は `NEXT_PUBLIC_` プレフィックスを付与する。
- 個別環境で上書きする値は `.env.local` に定義し、Git 管理から除外（Next.js が自動で除外）。
- サンプルは `frontend/.env.local.example` に保持し、環境ごとにコピーして調整する。

```bash
cp frontend/.env.local.example frontend/.env.local
```

## 2. 定義済みキー
| キー | 用途 | 備考 |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | API のベースURL（例: `http://localhost:8000/api`） | フロントの fetch/React Query で利用 |
| `NEXT_PUBLIC_FEATURE_FLAG_SAMPLE` | 機能フラグ例 | 実機の Feature Flag に合わせて増やす |
| `PLAYWRIGHT_BASE_URL` | Playwright で利用するベースURL | `playwright.config.ts` で参照 |
| `PLAYWRIGHT_PREVIEW` | Playwright 実行時に既存サーバーを利用するか | CIで `true` にすると dev サーバー起動をスキップ |

## 3. バックエンドとの連携
- Laravel 側 `.env` の `APP_URL` / `SANCTUM_STATEFUL_DOMAINS` を `NEXT_PUBLIC_API_BASE_URL` と整合させる。
- 認証 Cookie を使う場合は Next.js 側で `credentials: "include"` を設定し、CORS 設定と合わせて確認する。

## 4. CI/CD での扱い
- GitHub Actions などで `NEXT_PUBLIC_API_BASE_URL` を上書きする場合はリポジトリの `Secrets` / `Variables` に設定。
- Playwright E2E テストは `PLAYWRIGHT_PREVIEW=true` と `NEXT_PUBLIC_API_BASE_URL` を CI 用 URL に切り替える。

## 5. 今後の追加候補
- `NEXT_PUBLIC_SENTRY_DSN` など、監視・分析ツール用キー。
- `NEXT_PUBLIC_RELEASE_SHA` 等、デプロイメタデータの露出（PWA/ログ出力で利用）。
