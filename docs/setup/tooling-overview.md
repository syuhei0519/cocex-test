# 導入済みツール一覧（用途付き）

## バックエンド（Laravel）
| ツール | 用途 |
| --- | --- |
| Laravel Sanctum | API 認証（SPA/Cookie ベース） |
| Pest | ユニット・Feature テスト実行 |
| PHPStan (Larastan) | 静的解析、型チェック |
| Laravel Pint | コードフォーマッタ（PSR-12 + declare strict types） |
| UserSeeder + Factory | テストデータ投入 (`php artisan migrate --seed`) |

## フロントエンド（Next.js / React）
| ツール | 用途 |
| --- | --- |
| ESLint + simple-import-sort + React Hooks ルール | コード品質、import 順序・hooks 使用のチェック |
| Prettier | コード整形 |
| Jest + React Testing Library | ユニット／コンポーネントテスト |
| Playwright | ブラウザ E2E テスト (`npm run test:e2e`) |
| Storybook (React + Vite) | UI コンポーネント検証、ドキュメンテーション |
| OpenAPI Type Generator (`openapi-typescript`) | バックエンド仕様から型自動生成 (`npm run generate:types`) |
| React Query + fetch client | API コール共通化とキャッシュ |
| Axe Core (`@axe-core/react`) | 開発時アクセシビリティ警告 |
| Service Worker + Manifest | PWA 対応の足場（`sw.js` / `manifest.json`） |

## 共通 / DevOps
| ツール | 用途 |
| --- | --- |
| Docker Compose | PHP/MySQL/Redis/Node サービス起動・管理 |
| GitHub Actions ワークフロー案 | Lint/テスト/ビルドの自動化（ドラフト） |
| Playwright ブラウザ依存パッケージ | コンテナ内でブラウザを動かすための OS 依存関係 |

> 詳細な手順やトラブルシューティングは `docs/setup/seeders.md`、`docs/setup/env-management.md`、`docs/setup/pwa-accessibility.md`、`docs/setup/troubleshooting.md` を参照してください。
