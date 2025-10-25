# データベース初期データ投入手順

## 1. 概要
- `database/seeders/UserSeeder.php` を新設し、ユーザーのテストデータ（Factory 利用）を作成。
- `DatabaseSeeder` は今後のドメイン別 Seeder を追加するエントリーポイント。

## 2. 実行手順
```bash
# コンテナが起動している前提
docker compose exec app php artisan migrate --seed
```

- 既存データを入れ替える場合は `php artisan migrate:fresh --seed` を利用。
- シーダーだけを再実行したいときは `docker compose exec app php artisan db:seed --class=UserSeeder` のように個別指定可能。

## 3. Seeder 追加の流れ
1. `php artisan make:seeder XxxSeeder` で新規作成。
2. `DatabaseSeeder::$this->call()` 配列に追加。
3. Factory が未整備の場合は `database/factories` に作成してから利用。

## 4. 注意点
- 実運用データは含めず、開発・テスト用の安全なダミー値のみにする。
- Seeder 実行は Laravel の Queue/Events に依存しないよう完結させる。
