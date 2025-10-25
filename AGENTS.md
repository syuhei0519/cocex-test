# Repository Guidelines

> このドキュメントは日本語で維持し、更新時も日本語で編集してください。

## プロジェクト構成とモジュール配置
- `backend/` は Laravel 11 API を収めており、ビジネスロジックは `app/`、ルーティングは `routes/`、Blade/Vite 資産は `resources/`、DB マイグレーションとシーディングは `database/`、テストは `backend/tests/{Feature,Unit}` に配置されています。
- `frontend/` は Next.js 16 クライアントで、アプリルートは `src/app`、共通 UI は `src/components`、ユーティリティは `src/lib`、Playwright シナリオは `tests/e2e` にあります。
- `docs/` には参照資料（特に API タイピング用の `api/openapi.yaml`）があり、`docker/` には `docker-compose.yml` から読み込まれる Nginx などの設定が入っています。

## ビルド・テスト・開発コマンド
- `docker-compose up --build` で MySQL・Redis・Laravel・Next.js を含む開発用コンテナ群を起動します。
- `backend/` では `composer install && php artisan serve` で API を起動し、`npm install && npm run dev` を併用して Vite 資産を配信します。
- `frontend/` では `npm install && npm run dev` で Next.js 開発サーバーを立ち上げ、ローカル API に接続します。
- `composer test` / `composer test:feature` / `composer test:unit`、`npm run test`、`npm run test:e2e` で Pest・Jest・Playwright の各テストを実行します。

## コーディング規約と命名
- PHP は Laravel Pint (`composer lint`, `composer lint:fix`) で PSR-12 を遵守し、Larastan (`composer analyze`) で静的解析します。クラスは PascalCase、メソッドは camelCase、設定キーは snake_case を使ってください。
- TypeScript は ESLint (`npm run lint`) と Prettier (`npm run format`) を 2 スペースインデントで適用します。コンポーネントは PascalCase (`UserCard.tsx`)、フックは `useXxx.ts`、Tailwind のユーティリティクラスは JSX 内で記述します。
- API 契約を変更する際は `docs/api/openapi.yaml` を更新し、マージ前に `npm run generate:types` で型を再生成してください。

## テスト指針
- 新しいエンドポイントやキュージョブには Pest の Feature テストを追加し、ドメインロジックは `tests/Unit` のユニットテストで分離検証します。
- フロントエンド変更では近接するソース付近に Jest テスト (`*.test.ts?x`) を配置し、主要なユーザーフローは `tests/e2e` の Playwright で確認します。

## コミットとプルリクエスト
- コミットは Conventional Commits (`type(scope): summary`) に従い、履歴に見られる `chore(frontend): ...` や `fix: ...` の形式を踏襲します。本文で課題番号を参照する場合は `Refs #42` のように記載してください。
- ブランチはリベースまたはスカッシュで整え、バックエンドとフロントエンドを同時に変更する場合はそれぞれの影響範囲を説明します。
- PR には簡潔なサマリー、UI 変更時のスクリーンショット、実行済みコマンドやテストの記録、再現に必要な設定手順を含めてください。
- 開発時は `main` から派生ブランチを作成し、`main` 向けに PR を提出してください。コミットメッセージと PR のタイトル・説明は日本語で記述します。

## セキュリティと設定の注意
- `.env`、`storage/`、生成された認証情報はコミットせず、環境変数の追加は `.env.example` を更新して共有します。
- 機密情報はローカルの `.env` / `.env.local` に保存し、Docker 上書き設定は追跡されない個人ファイルで管理してください。
