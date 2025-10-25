# CI/CD ワークフロー案（ドラフト）

## 1. ゴール
- プルリク時に Laravel / React 双方の静的解析・テストを自動実行。
- main ブランチへのマージ時に Docker イメージビルドやデプロイトリガーを行う準備を整える。

## 2. 推奨構成（GitHub Actions 想定）

### 2.1 共有ステップ
- `actions/checkout@v4`
- `actions/setup-node@v4`（Node 20）
- `shivammathur/setup-php@v2`（PHP 8.3）
- キャッシュ：`actions/cache` で `~/.npm`, `~/.composer/cache` を保存

### 2.2 ジョブ例
1. **lint-and-test-backend**
   - `composer install --no-progress --no-interaction`
   - `cp .env.example .env` / `php artisan key:generate`
   - `php artisan migrate --env=testing`
   - `composer lint`（Laravel Pint）
   - `composer analyze`（PHPStan）
   - `composer test`（Pest）

2. **lint-and-test-frontend**
   - `npm ci`
   - `npm run generate:types`
   - `npm run lint`
   - `npm run test`（Jest/RTL 導入後に有効化）

3. **build-docker (main ブランチのみ)**
   - 依存: lint/test ジョブ成功時
   - `docker build -f backend/Dockerfile` / `frontend/Dockerfile` など
   - コンテナレジストリ (GHCR 等) への push は後続課題

## 3. 今後の拡張
- E2E テスト（Playwright）を別ジョブで実行
- スケジュール実行（夜間の migrate --seed 検証）
- main マージ後にデプロイ環境へ通知（GitHub Deployments / Slack）

---
このドキュメントは暫定案。実装時は Secrets 管理, キャッシュキー, 並列実行数などを調整してください。
