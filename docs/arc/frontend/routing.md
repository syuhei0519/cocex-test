# ルーティング構成

Next.js App Router を利用し、認証有無でセグメントを分けています。

```mermaid
flowchart LR
    Root[(src/app)] --> Public((page.tsx))
    Root --> AuthSegment["(auth)"]
    Root --> ProtectedSegment["(protected)"]

    AuthSegment --> LoginPage[login/page.tsx]
    AuthSegment --> RegisterPage[register/page.tsx]

    ProtectedSegment --> Layout[layout.tsx]
    Layout --> DashboardPage[app/page.tsx]
    Layout --> TransactionsPage[app/transactions/page.tsx]
    Layout --> AccountsPage[app/accounts/page.tsx]
    Layout --> SettingsPage[app/settings/page.tsx]

    classDef auth fill:#fef3c7,stroke:#fbbf24;
    classDef protected fill:#e0f2fe,stroke:#3b82f6;

    class AuthSegment,LoginPage,RegisterPage auth;
    class ProtectedSegment,Layout,DashboardPage,TransactionsPage,AccountsPage,SettingsPage protected;
```

## ルーティングのポイント

- `(auth)` 配下は未ログイン時のみアクセス可能。ログイン済みであれば `/app` へリダイレクト。
- `(protected)` 配下は `AuthGuard` で `/auth/me` を確認し、未ログイン時は `/login` へ遷移。
- `routes/paths.ts` にルート定義をまとめ、UI からのリンクはここを参照する。
