# MVP MUST 機能 実装タスクリスト

進捗管理のため、実装タスクとテストタスクをチェックリスト形式で整理しています。  
タスクはバックエンド（Laravel）、フロントエンド（React）、共通基盤で分類しています。

## 1. 共通基盤
- [x] Docker Compose（Laravel + MySQL + Redis + Node）環境構築
- [x] Laravel プロジェクト初期設定（Sail/独自構成、.env、環境毎設定）
- [x] Laravel ESLint/PHPStan/Pest 等の開発支援ツール導入
- [x] React プロジェクト初期化（Next.js + TypeScript）
- [x] OpenAPI 仕様連携パイプライン（Lint、生成ツール設定）
- [x] 手動テスト実行フロー（Pest / Jest / E2E）の手順書整備（`docs/setup/manual-test-runbook.md`）
- [ ] CI/CD パイプライン設計案（アプリ完成後に実装）をドキュメント化

## 2. バックエンド（Laravel API）

### 2.1 Auth / User ドメイン
- [ ] ユーザー登録 API（メール検証含む）実装
- [ ] ログイン／ログアウト API（Sanctum）実装
- [ ] プロファイル更新 API 実装
- [ ] パスワードリセット（リクエスト／実行）API 実装
- [ ] 上記 API の Pest テスト（ユニット＋Feature）整備
- [ ] メールテンプレート・キュー連携の統合テスト

### 2.2 Accounts / Categories / PaymentMethods
- [ ] 口座 CRUD API 実装
- [ ] カテゴリ CRUD API 実装（階層 1 階層対応）
- [ ] 支払い方法 CRUD API 実装
- [ ] 各 CRUD API のバリデーション・認可ルール実装
- [ ] 各 API の Pest テスト（正常／異常パターン）

### 2.3 Transactions
- [ ] 取引一覧・検索 API 実装（ページング・フィルタ）
- [ ] 取引登録／更新／削除 API 実装
- [ ] CSV エクスポート（エクスポートジョブ登録）実装
- [ ] 取引関連の Pest テスト（リポジトリ・Feature）
- [ ] エクスポートジョブのキューワーカー・結果確認テスト

### 2.4 Budgets
- [ ] 月次予算取得／設定 API 実装
- [ ] 前月コピー API 実装
- [ ] 予算サマリー（実績比較）API 実装
- [ ] Budgets ドメインの Pest テスト（ドメインサービス・Feature）

### 2.5 Reports
- [ ] ダッシュボード API 実装（トップ指標・カテゴリ Top5・最新取引）
- [ ] 任意期間サマリー API 実装
- [ ] 月次サマリー PDF エクスポートジョブ実装
- [ ] レポート用クエリのパフォーマンステスト・Pest Feature テスト

### 2.6 Notifications
- [ ] 通知一覧／既読更新 API 実装
- [ ] 予算超過アラートのドメインイベント→通知発火ロジック実装
- [ ] パスワードリセット等のメールテンプレート整備
- [ ] 通知 API／イベントの Pest テスト

### 2.7 Integrations（プレースホルダ）
- [ ] 外部連携プロバイダ一覧 API 実装（静的マスタ）
- [ ] 連携設定取得 API 実装（プレースホルダ）
- [ ] Webhook 受信エンドポイント（署名検証・キュー投入）実装
- [ ] 上記 API の Pest テスト

## 3. フロントエンド（React / Next.js）

### 3.1 共通
- [x] 環境構築（ESLint/Prettier/Jest/React Testing Library）
- [x] OpenAPI 仕様からの型・API クライアント生成
- [x] API クライアント基盤整備（fetch ラッパー + React Query）
- [x] ルーティング・状態管理（React Query/SWR 等）基盤構築

### 3.2 認証
- [ ] 登録／ログイン／ログアウト UI フロー実装
- [ ] パスワードリセット UI 実装
- [ ] プロファイル編集 UI 実装
- [ ] 認証関連のコンポーネントテスト・E2E テスト

### 3.3 取引・マスタ管理
- [ ] ダッシュボード画面（指標表示、トップカテゴリ、最近の取引）
- [ ] 取引一覧／検索 UI 実装
- [ ] 取引登録／編集モーダル・フォーム実装
- [ ] 口座／カテゴリ／支払い方法管理 UI 実装
- [ ] CSV エクスポート操作 UI 実装
- [ ] 上記画面の Jest/RTL テスト、E2E テスト

### 3.4 予算・レポート・通知
- [ ] 月次予算設定 UI（カテゴリごとの入力 + コピー機能）
- [ ] 予算実績サマリー表示 UI
- [ ] 任意期間レポート画面（グラフ／集計）
- [ ] 月次サマリー PDF エクスポート UI
- [ ] 通知一覧・既読管理 UI
- [ ] 上記画面の Jest/RTL テスト、E2E テスト

## 4. リリース前チェック
- [ ] API ドキュメント更新（OpenAPI → HTML or Stoplight）
- [ ] ユーザー手順書 / 初期オンボーディングガイド作成
- [ ] セキュリティ設定確認（CSP、CORS、CSRF）
- [ ] バックアップ・ローテーション手順確認
- [ ] MVP リリース判定レビュー（チェックリスト完了確認）

---
作成日：2025-10-23 / Update me when progress changes
