# フロントエンド API クライアント層の概要

生成された OpenAPI 型 (`src/lib/api/types.ts`) を活用するためのクライアント基盤を整備しました。ここでは構成と利用手順をまとめます。

## 1. ディレクトリ構成
- `src/lib/http/client.ts` … Fetch API をラップした共通クライアント。リクエストパスの置換、クエリ文字列の組立、JSON 変換、エラーハンドリングを実装。
- `src/lib/api/endpoints.ts` … OpenAPI 型を扱いやすくするためのユーティリティ型を提供。
- `src/lib/queries/auth.ts` … 認証系の例として、`useLoginMutation` / `useCurrentUserQuery` フックを実装。
- `src/app/providers.tsx` … React Query の `QueryClientProvider`（devtools 含む）。`layout.tsx` から参照しています。

## 2. 基本的な使い方
```tsx
import { useCurrentUserQuery, useLoginMutation } from "@/lib/queries/auth";

const Component = () => {
  const { data: currentUser } = useCurrentUserQuery({ suspense: false });
  const login = useLoginMutation();

  const handleLogin = () => {
    login.mutate({ email: "user@example.com", password: "secret" });
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <pre>{JSON.stringify(currentUser)}</pre>
    </div>
  );
};
```

`apiClient` はジェネリクスで OpenAPI の型を解決するため、各クエリ/ミューテーションでは `EndpointOperation` などを経由してリクエスト／レスポンスが型付けされます。

## 3. 新しいエンドポイントを追加する手順
1. `npm run generate:types` で最新の型を生成。
2. `src/lib/api/endpoints.ts` のユーティリティ型を使ってエンドポイント固有の型エイリアスを作成（例：`type FooOperation = EndpointOperation<"/foo", "post">`）。
3. `src/lib/http/client.ts` の `apiClient` を利用して、`src/lib/queries/` 以下に React Query フックを実装。
4. 画面側からは React Query フックをインポートして利用。

## 4. エラーハンドリング
- `apiClient` はステータスコードが 2xx 以外の場合に `ApiError` を throw します。（`status` と `payload` を保持）
- React Query の `onError` / `useMutation` のエラーバウンドリでこの `ApiError` を受け取り、`payload` を参照する構成を想定しています。

## 5. DevTools
- 開発時 (`NODE_ENV !== "production"`) は自動で React Query Devtools が表示されます。不要な場合は `AppQueryProvider` 内の条件分岐を調整してください。

この骨組みの上にドメインごとの Query/Mutaion ファイルを追加していく方針です。
