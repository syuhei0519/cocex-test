# OpenAPI 型生成ワークフロー

フロントエンド（Next.js）で API 型を自動生成し、バックエンドの OpenAPI 仕様と同期するための手順です。

## 1. 事前要件
- `docker compose up -d` で `frontend` サービスが起動していること。
- OpenAPI 仕様ファイルは `docs/api/openapi.yaml` に存在すること（Laravel 側で更新する）。

## 2. ツール
- `openapi-typescript@6.7.0`（`frontend` の devDependencies に追加済み）
- 生成スクリプト：`npm run generate:types`
- 出力先：`frontend/src/lib/api/types.ts`

## 3. 実行手順
```bash
# フロントエンドコンテナ内で実行
docker compose exec frontend npm run generate:types
```

- コンテナには `./docs` を `/usr/src/docs` としてマウントしているため、コマンドは常に最新の仕様を参照します。
- コマンド実行時に `✨ openapi-typescript ...` のログが出力されれば成功です。
- 生成結果は TypeScript の型定義のみで、API クライアントは別途実装します（React Query 等で活用予定）。

## 4. 更新の流れ
1. `docs/api/openapi.yaml` を更新（バックエンドの仕様変更）。
2. `docker compose exec frontend npm run generate:types` を実行し、`src/lib/api/types.ts` を再生成。
3. 必要に応じて React 側の API 呼び出しコードをアップデート。

## 5. トラブルシューティング
- `Can't parse empty schema` などのエラーが出る場合は OpenAPI 仕様に空の `schema` がないか確認する。
- 仕様ファイルへのパスが変わった場合は `docker-compose.yml` の `frontend` サービスにマウントされている `./docs` を更新し、`npm run generate:types` のコマンド引数も合わせて変更する。
- 生成ファイルを Git で管理するため、忘れずにコミット対象に含める。
