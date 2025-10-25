# Docker Compose 開発環境セットアップ手順

初回構築前に `.env.example` を参考に環境変数を設定してください。

## 1. 事前準備
```bash
cp .env.example .env
```

- `APP_UID` / `APP_GID` はホストのユーザー ID / グループ ID に合わせると、コンテナ内で作成されたファイルの所有権問題を避けられます。
- データベースやポート番号を変更する場合は `.env` を更新してください。

## 2. ビルドと起動
```bash
docker compose build
docker compose up -d
```

- 初回は各サービスのイメージをビルドします。`frontend` は `package.json` が無い場合インストールをスキップします。
- `docker compose ps` で状態を確認できます。

## 3. Laravel プロジェクトの作成／依存関係インストール
コンテナ内で Laravel を作成するか、既存プロジェクトを配置します。`create-project` は空ディレクトリが前提なので、以下の手順で一時ディレクトリを使うのが安全です。

```bash
docker compose exec app bash

# 例：Laravel 新規作成（tmp に展開し、ルートへコピー）
composer create-project laravel/laravel:^11.0 tmp
cp -a tmp/. .
rm -rf tmp

# 既存プロジェクトなら composer install のみ
composer install
php artisan key:generate
php artisan migrate
exit
```

### ファイル権限
- `storage` と `bootstrap/cache` に書き込み権限が必要です。必要に応じて以下を実行してください。
```bash
docker compose exec app php artisan storage:link
docker compose exec app chmod -R ug+w storage bootstrap/cache
```

### よくあるエラーと対処
- `Project directory ".../." is not empty.`  
  -> `tmp` など一時ディレクトリで `composer create-project` を実行してからコピーする。
- `Permission denied` でファイルコピーが失敗する  
  -> 一度 root で `docker compose exec --user root app bash` として入り、`chown -R appuser:appuser /var/www/html` を実行してから再試行する。

## 4. フロントエンド（React / Next.js）セットアップ
`create-next-app` も空ディレクトリが前提のため、一時ディレクトリ方式でセットアップします。

```bash
docker compose exec frontend sh

# 例：Next.js プロジェクト新規作成（TypeScript/ESLint/新appディレクトリ構成）
npm create next-app@latest tmp -- --typescript --eslint --src-dir --app
rm -rf tmp/node_modules
cp -a tmp/. .
rm -rf tmp
npm install
npm run dev
```

- `NEXT_PUBLIC_API_BASE_URL` は `.env` の `APP_PORT` に合わせて調整してください。
- Node コンテナはポート `3000` をホストに公開しています。

### よくあるエラーと対処
- `The directory ... contains files that could conflict`  
  -> 上記のように `tmp` ディレクトリで生成してからコピーする。
- `rm: can't remove 'node_modules': Resource busy`  
  -> `node_modules` は匿名ボリュームでマウントされているため削除不可。`tmp/node_modules` を削除してからコピーするか、`docker compose down -v` でボリュームを破棄する。
- `npm ERR! code EACCES`（権限不足）  
  -> 一度 root で `docker compose exec --user root frontend sh -c "chown -R node:node /usr/src/app"` を実行し、所有者を `node` に合わせてから `npm install` を再実行する。

## 5. 手動テスト実行（例）
- バックエンド：`docker compose exec app php artisan test`
- フロントエンド：`docker compose exec frontend npm test`
- E2E（Playwright など）を追加する場合は別途コンテナに依存関係を導入してください。

## 6. 停止とクリーンアップ
```bash
docker compose down
# ボリュームも削除する場合
docker compose down -v
```

## 7. 補足
- MySQL はポート `3307` でホストからアクセスできます（`.env` で上書き可）。
- Redis はポート `6380` にマッピングしています。
- CI/CD はアプリ完成後に導入予定のため、パイプライン定義はまだ追加していません。

---
作成日：2025-10-23  
更新時はこのドキュメントを修正してください。
