# 手動テスト実行フロー（Pest / Jest / Playwright）

バックエンドとフロントエンドの回帰確認を手動で行う際の基本手順をまとめます。  
CI 導入前のリリース判定やバグ修正の最終確認に活用してください。

## 1. 共通準備
- リポジトリルートで `docker compose up -d` を実行し、MySQL・Redis・Laravel・Next.js コンテナを起動する。初回は `--build` を付与して依存関係を更新する。
- `.env` / `.env.local` などは `*.example` からコピーし、必要なベース URL・DB 情報を最新化する。
- 依存パッケージが未インストールの場合は、それぞれのディレクトリで `composer install` / `npm install` を実行する。
- 以降のコマンドはコンテナ内での実行を推奨する（例: `docker compose exec app ...`）。

## 2. Pest（Laravel API）
### 2.1 テスト DB の準備
1. `backend/.env.example` を複製し、テスト用に `backend/.env.testing` を作成する。
2. `DB_DATABASE` を本番／開発と別名の `laravel_testing` などに変更する。MySQL に DB が存在しない場合は `docker compose exec mysql mysql -uroot -p` で作成する。
3. 必要に応じて `QUEUE_CONNECTION=sync` などテスト向け設定を追加する。

```bash
cp backend/.env.example backend/.env.testing
# backend/.env.testing を開き、DB_DATABASE, DB_USERNAME, DB_PASSWORD をテスト用に調整
docker compose exec app php artisan key:generate --env=testing
docker compose exec app php artisan migrate --env=testing
```

### 2.2 テスト実行コマンド
- 全テスト: `docker compose exec app composer test`
- Feature のみ: `docker compose exec app composer test:feature`
- Unit のみ: `docker compose exec app composer test:unit`
- 特定ファイル: `docker compose exec app ./vendor/bin/pest tests/Feature/UserTest.php`

完了後は `storage/logs/laravel.log` にエラーが出ていないか確認し、異常終了したケースは `tests/Pest.php` に定義されたセットアップが失敗していないかをチェックする。

## 3. Jest（Next.js / React）
### 3.1 前提
- `frontend/.env.local.example` を `frontend/.env.local` にコピーし、`NEXT_PUBLIC_API_BASE_URL` を起動中の Laravel API（例: `http://localhost:8000/api`）にそろえる。
- 依存のインストールが済んでいなければ `npm install` を実行する。

```bash
cd frontend
cp .env.local.example .env.local
npm install
```

### 3.2 テスト実行
- 通常実行: `npm run test`
- 監視モード: `npm run test -- --watch`
- 単一ファイル指定: `npm run test -- src/components/Form/UserForm.test.tsx`

テスト失敗時は `coverage` ディレクトリ（生成されていれば）と `jest.log` を確認し、モックや API スタブの設定を見直す。UI 変更時は Snapshot の更新が必要かどうかも合わせてチェックする。

## 4. Playwright（E2E）
### 4.1 初期セットアップ
- 初回のみブラウザバイナリを取得: `npx playwright install`
- OS 依存パッケージが不足する場合は `npx playwright install-deps`（ローカル環境のみ）。
- `PLAYWRIGHT_BASE_URL` を `.env.local` で設定し、Next.js dev サーバーの URL と合わせる。

### 4.2 サーバーの用意
- 既存の dev サーバーを使う場合:
  1. `backend` 側で `docker compose exec app php artisan serve --host=0.0.0.0 --port=8000` を実行。
  2. `frontend` 側で `npm run dev` を起動。
  3. 別ターミナルで `PLAYWRIGHT_PREVIEW=true npm run test:e2e` を実行（既存サーバーを再利用）。
- Playwright に自動起動させる場合:
  - `npm run test:e2e` をそのまま実行すると `npm run dev` が自動で立ち上がり、テスト終了後に終了する。

### 4.3 実行パターン
- 全テスト実行: `npm run test:e2e`
- 単体ケース: `npx playwright test tests/e2e/auth/login.spec.ts`
- デバッグ UI: `npx playwright test --debug`
- レポート閲覧: `npx playwright show-report`

テストで API 通信を行うため、Laravel 側のベース URL が疎通できることを事前に確認する。Cookie/セッションを扱うシナリオでは `SANCTUM_STATEFUL_DOMAINS` の設定値がブラウザ URL と一致しているかも併せてチェックする。

## 5. よくある確認ポイント
- **依存パッケージ不足**: `npm install` や `composer install` を忘れずに実行。バージョン差異がある場合は `rm -rf node_modules vendor` は行わず、Docker コンテナを再構築する。
- **環境変数の不整合**: `.env.testing` / `.env.local` と `docker-compose.yml` のポートを揃える。
- **Playwright のタイムアウト**: API が遅延している場合はテストケース内で `page.waitForResponse` を明示的に追加するか、`playwright.config.ts` の `timeout` を見直す。
- **DB リセット忘れ**: Pest 実行前に `php artisan migrate:fresh --seed --env=testing` を行うと初期データを再投入できる。

---
更新日: 2025-03-18 / 本手順の改善提案があれば `docs/setup/manual-test-runbook.md` を直接編集してください。
