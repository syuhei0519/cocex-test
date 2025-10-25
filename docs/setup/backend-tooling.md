# バックエンド開発支援ツール運用メモ

Laravel API プロジェクトで導入したツールと実行コマンドをまとめます。

## 1. 認証基盤（Sanctum）
- `composer require laravel/sanctum` 済み。`config/auth.php` に `api` ガード（driver: `sanctum`）を追加。
- `app/Models/User` は `Laravel\Sanctum\HasApiTokens` を use 済み。
- `bootstrap/app.php` の `withMiddleware` で `EnsureFrontendRequestsAreStateful` を web ミドルウェアに追加済み。
- マイグレーション／設定ファイルは `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"` で公開済み（`database/migrations/****_create_personal_access_tokens_table.php` と `config/sanctum.php`）。
- Cookie ベースの SPA 認証を使う場合は `SANCTUM_STATEFUL_DOMAINS` を `.env` に設定しておく。

## 2. テストフレームワーク（Pest）
- 導入コマンド：`composer require pestphp/pest pestphp/pest-plugin-laravel --dev`.
- 初期化：`./vendor/bin/pest --init`。
- 実行方法：
  - 全テスト：`docker compose exec app composer test`
  - Feature テストのみ：`docker compose exec app composer test:feature`
  - Unit テストのみ：`docker compose exec app composer test:unit`
- テストはデフォルトで `tests/Pest.php` 経由で Laravel の `Tests\TestCase` を利用します。

## 3. 静的解析（Larastan + PHPStan）
- パッケージ：`composer require --dev larastan/larastan`.
- 設定ファイル：`phpstan.neon.dist`（パス `app/`, `config/`, `database/`, `bootstrap/app.php` を解析対象に設定）。
- キャッシュディレクトリ：`storage/framework/cache/phpstan`。
- 実行：`docker compose exec app composer analyze`
- エラーが出た場合、`phpstan.neon` に追記せず、可能な限りコードや PHPDoc を修正する方針。

## 4. コードスタイル（Laravel Pint）
- 設定ファイル：`pint.json`（`preset: laravel`、`declare_strict_types` などを有効化）。
- 実行：
  - チェック＆自動修正：`docker compose exec app composer lint`
  - 差分ファイルのみ：`docker compose exec app composer lint:fix`
- 既定で `storage/`, `bootstrap/cache`, `vendor/` は除外。

## 5. コマンド一覧（Composer Script）
| コマンド | 内容 |
| --- | --- |
| `composer test` | Pest で全テスト実行 |
| `composer test:feature` | Feature テストのみ |
| `composer test:unit` | Unit テストのみ |
| `composer analyze` | PHPStan(Larastan) 実行 |
| `composer lint` | Laravel Pint によるコード整形（全ファイル） |
| `composer lint:fix` | 変更差分に絞った Pint 実行 |

## 6. 運用上のメモ
- コンテナ内で実行する場合は `docker compose exec app` を冒頭に付与。
- PHPStan のエラーは型指定（PHPDoc または返り値定義）を揃えることで解決する。
- Pint 実行後は `declare(strict_types=1);` が追加されるため、PHP ファイルの冒頭に自動で挿入されます。外したいファイルは `pint.json` の `exclude` に追加。
