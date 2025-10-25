# セットアップ時に遭遇したエラーと対処方法

## 1. Laravel 開発支援ツール導入時

### 1-1. `composer analyze` で `Invalid configuration: Unexpected item 'checkMissingIterableValueType'`
- **原因**: Larastan/PHPStan v2 系では `checkMissingIterableValueType` や `checkGenericClassInNonGenericObjectType` といった旧オプションが廃止されている。
- **対処**: `phpstan.neon.dist` から該当キーを削除し、サポートされている設定のみを残す。

### 1-2. UserFactory で `method.childReturnType` エラー
- **エラー例**: `Return type (array<string, mixed>) ... should be compatible with ...`
- **原因**: Factory の戻り値がジェネリック型と一致していないため、Larastan が型不整合を検知。
- **対処**: `Database\Factories\UserFactory::definition()` に具体的な配列シグネチャを PHPDoc で定義（例：`@return array{ name: string, ... }`）。

### 1-3. Larastan 導入後の `Ambiguous class resolution`
- **エラー例**: `Ambiguous class resolution ... nunomaduro/larastan ... larastan/larastan`
- **原因**: 旧パッケージ `nunomaduro/larastan` と新パッケージ `larastan/larastan` が同時にインストールされ、同名クラスが競合。
- **対処**: `composer remove nunomaduro/larastan --dev` を実行し、`larastan/larastan` のみを利用。

### 1-4. Laravel Pint 実行で大量の `declare(strict_types=1);` が追加
- **現象**: `composer lint` 実行後に PHP ファイルへ `declare(strict_types=1);` が自動挿入。
- **原因**: `pint.json` で `declare_strict_types` を有効化しているため。
- **対処**: 基本は採用方針として受け入れる。特定ファイルで不要な場合は `pint.json` の `exclude` に追加。

## 2. OpenAPI 型生成ワークフロー構築時

### 2-1. `Can't parse empty schema`
- **コマンド**: `npm run generate:types`
- **原因**: `openapi-typescript` v7 系では Redocly ベースのバンドルが必要で、単独の YAML を直接読むと失敗するケースがある。
- **対処**: バージョンを `openapi-typescript@6.7.0` に固定して再実行。

### 2-2. `Cannot use 'in' operator to search for 'components' in undefined`
- **原因**: v6 系では `--config` オプションによる設定ファイル読み込みがサポートされていない。
- **対処**: 設定ファイルを使わず、CLI に直接パスと出力先を渡す（例：`openapi-typescript /usr/src/docs/api/openapi.yaml --output src/lib/api/types.ts`）。

### 2-3. Frontend コンテナが `docs/api/openapi.yaml` にアクセスできない
- **現象**: `ENOENT` や `Can't parse empty schema` が解消しない。
- **原因**: `docker-compose.yml` の `frontend` サービスで `./docs` ディレクトリをマウントしていなかった。
- **対処**: `volumes` に `- ./docs:/usr/src/docs:ro` を追加し、コンテナ内から常に最新の OpenAPI 仕様を参照できるようにする。

## 3. フロントエンド API クライアント層構築時

### 3-1. React Query を使うための Provider が無い
- **現象**: React Query の `useQuery` / `useMutation` を利用しようとすると、`QueryClientProvider` が見つからない旨の例外が発生。
- **原因**: App Router 直下で共通の Provider を設定していなかった。
- **対処**: `src/app/providers.tsx` に `QueryClientProvider` を定義し、`src/app/layout.tsx` で `AppQueryProvider` で子要素をラップする。

### 3-2. OpenAPI 型を直接 import するとジェネリクスが複雑化
- **現象**: 各クエリで `operations["foo"]` などから型を取り出す際にジェネリクスが煩雑になる。
- **対処**: `src/lib/api/endpoints.ts` にラッパー型 (`EndpointOperation`, `ApiResponse`, など) を作成し、共通的に利用する。

### 3-3. PATH パラメータ／クエリの展開ミス
- **現象**: `apiClient` で `pathParams` や `query` を展開しないまま fetch を呼び出すと、`{id}` が置換されず 404 になる。
- **対処**: `client.ts` で `pathParams` と `query` を明示的に処理し、`encodeURIComponent` や `URLSearchParams` を通すよう修正。

### 3-4. Storybook が Next.js 16 と互換しない
- **現象**: `npx storybook@latest init` 実行時に `@storybook/nextjs` の peer dependency が `next@^14 || ^15` に固定されインストール失敗。
- **対処**: Next.js 専用プリセットは使用せず、`@storybook/react-vite@8` 系で最小構成を導入。将来 Next.js 16 対応版がリリースされたら置き換える。

### 3-5. Playwright が Alpine ベースのコンテナで起動しない
- **現象**: `browserType.launch: Failed to launch` や `missing dependencies` が発生。
- **対処**: フロントエンド Docker イメージを `node:20-bullseye` に変更し、`apt-get` で Playwright 依存ライブラリ一式をインストール。ブラウザダウンロード後にテスト成功。

---
これらの対処により、Laravel 側の開発支援ツールと OpenAPI 型生成フローの両方が安定して動作するようになりました。再発した場合は上記手順を参照してください。
