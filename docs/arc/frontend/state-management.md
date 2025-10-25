# 状態管理の概要

React Query を中心に認証状態とドメインデータを管理しています。以下の図は主要なクエリ・ミューテーションと、UI コンポーネントの依存関係を表します。

```mermaid
graph TD
    subgraph ReactQuery
        CurrentUserQuery[/useCurrentUserQuery/]
        LoginMutation[[useLoginMutation]]
        RegisterMutation[[useRegisterMutation]]
        LogoutMutation[[useLogoutMutation]]
    end

    LoginPage[ログインページ] --> LoginMutation
    LoginMutation --> CurrentUserQuery
    AppProviders[AppQueryProvider] --> CurrentUserQuery
    AppShell --> LogoutMutation
    RegisterPage --> RegisterMutation

    RegisterMutation --> RegisterSuccess[登録完了画面]
    LoginMutation --> AppShell
    LogoutMutation --> LoginPage

    classDef query fill:#e0f2fe,stroke:#0284c7;
    classDef mutation fill:#fee2e2,stroke:#ef4444;

    class CurrentUserQuery query;
    class LoginMutation,RegisterMutation,LogoutMutation mutation;
```

## 補足

- 認証周りのキャッシュキーは `authKeys` に統一し、ログアウト時は `removeQueries({ queryKey: authKeys.all })` で破棄。
- その他のドメインデータ（取引など）は別途 `src/lib/queries/` で管理予定。
