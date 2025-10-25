# 家計簿アプリ ドメインマップ（初版）

## 0. ドキュメントの目的
- 初期リリースは Laravel 11（API）＋ MySQL 8 ＋ Redis、フロントエンドは React（TypeScript）を想定。
- モジュラーモノリスとして実装しつつ、将来的なマイクロサービス分割を見据えた境界の明確化を行う。
- 本書では主要ドメイン（バウンデッドコンテキスト）とその責務、主要エンティティ、外部連携ポイントを整理する。

## 1. システム全体像（俯瞰）
- フロントエンド：React（Next.js を想定）で SPA/SSR を実現。API とは REST/JSON で通信。
- API：Laravel 11。各ドメインは内包モジュールとして実装し、サービス層＋リポジトリ層でビジネスロジックと DB アクセスを分離。
- データベース：MySQL 8（RDS/Aurora も将来検討）。スキーマはドメインごとにテーブル命名を分けておき、将来移行しやすくする。
- キャッシュ・非同期処理：Redis（セッション共有、キュー、レートリミット、イベントバス用途）。
- 認証・認可：初期は Laravel Sanctum（REST API トークン）を利用。将来的には OAuth2/OIDC に移行可能な構造を前提。
- ログ／メトリクス：Monolog＋構造化ログ、Laravel Telescope、後に OpenTelemetry 対応を検討。

## 2. バウンデッドコンテキスト一覧

### 2.1 User（ユーザー・アカウント管理）
- **責務**：ユーザー登録、ログイン、プロファイル編集、利用規約・プライバシー同意管理、二段階認証（将来）。
- **主なエンティティ**：`User`、`UserProfile`、`UserSetting`、`Credential`。
- **主要ユースケース**：
  - 新規登録（メール確認／パスワード設定）
  - ログイン／トークン発行（Sanctum）
  - アカウント情報更新、パスワードリセット
  - サービス固有設定（通貨、言語、日付フォーマット）
- **将来分割時の想定**：認証・認可サービスとして独立、OAuth Provider 化、他サービスでも再利用。

### 2.2 Accounting（収支入力・取引管理）
- **責務**：収入・支出の記録、カテゴリ・支払い方法の管理、添付ファイル（レシート）の紐付け。
- **主なエンティティ**：`Account`、`Transaction`、`Category`、`PaymentMethod`、`ReceiptAttachment`。
- **主要ユースケース**：
  - 取引の登録／編集／削除（単発・定期）
  - 取引のインポート（CSV）／エクスポート
  - カテゴリ／支払い手段の管理
  - 添付ファイルアップロード（S3 互換ストレージ前提）
- **将来分割時の想定**：取引サービスとして独立。勘定データの API 提供、イベントで Reporting と連携。

### 2.3 Budgeting（予算管理）
- **責務**：月次・カテゴリ別の予算設定、実績との比較、アラート基準の定義。
- **主なエンティティ**：`Budget`、`BudgetCategory`、`BudgetRule`、`BudgetAlertSetting`。
- **主要ユースケース**：
  - カテゴリ別予算の設定／コピー（前月踏襲）
  - 実績との差分計算（Accounting からデータ取得）
  - 閾値超過時のアラートキュー発行
- **将来分割時の想定**：独立した予算サービス。Accounting からイベント購読、Notifications へアラート発行。

### 2.4 Reporting（レポート・可視化）
- **責務**：収支の集計、ダッシュボード表示用データ供給、期間別・カテゴリ別レポート生成、PDF/CSV 出力。
- **主なエンティティ**：`ReportSnapshot`、`DashboardWidget`、`ReportTemplate`。
- **主要ユースケース**：
  - 月次／週次レポート生成（バッチ or オンデマンド）
  - カスタムビュー定義と保存
  - エクスポート処理（CSV/PDF）
- **将来分割時の想定**：分析サービスとして独立。イベントソーシング基盤やデータウェアハウスへの書き出しも検討。

### 2.5 Notifications（通知）
- **責務**：アプリ内通知、メール、プッシュ通知（将来）を統合管理。Budgeting のアラートや Reporting の定期配信を扱う。
- **主なエンティティ**：`Notification`、`NotificationChannel`、`NotificationTemplate`、`DeliveryLog`。
- **主要ユースケース**：
  - キューに積まれた通知イベントの処理
  - テンプレート管理と多言語化
  - 配信結果のログ蓄積と再送制御
- **将来分割時の想定**：通知サービスとして独立。外部メッセージング基盤（SES、Firebase Cloud Messaging 等）と連携。

### 2.6 Settings & Integrations（拡張設定・外部連携）
- **責務**：金融機関 API、レシート OCR、Webhooks などの外部サービス連携、アプリ全体の環境設定。
- **主なエンティティ**：`IntegrationProvider`、`IntegrationToken`、`WebhookEndpoint`、`SystemSetting`。
- **主要ユースケース**：
  - 外部連携の有効化／無効化
  - トークン更新、連携状態監視
  - Webhook 受付とキュー投入
- **将来分割時の想定**：各連携ごとにサービス分割、もしくは BFF（Backend for Frontend）経由で専用サービスに委任。

## 3. モジュール間インターフェース（現時点の方針）
- **API 契約**：REST + JSON。OpenAPI 3 で仕様化し、React クライアントは生成（openapi-typescript）を検討。
- **内部イベント**：Laravel のキュー経由で `DomainEvent` を発行し、必要に応じて Redis Pub/Sub やメッセージブローカーへの移行を想定。
- **データアクセス層**：各モジュールごとにリポジトリとサービスを分け、他モジュールのテーブルを直接参照しない（将来の DB 分割を見越す）。
- **認証情報共有**：Sanctum によるトークンを共通利用。React 側は Cookie ベース（SPA）またはヘッダー送信（SSG/SSR）。

## 4. データモデルの初期アウトライン
- **User ドメイン**：`users`、`user_profiles`、`user_settings`。
- **Accounting ドメイン**：`accounts`（口座）、`transactions`（取引本体）、`transaction_items`（複数明細対応）、`categories`、`payment_methods`、`attachments`。
- **Budgeting ドメイン**：`budgets`、`budget_categories`、`budget_alert_settings`。
- **Reporting ドメイン**：`report_snapshots`、`dashboard_widgets`、`export_jobs`。
- **Notifications ドメイン**：`notifications`、`notification_channels`、`notification_templates`、`delivery_logs`。
- **Integrations ドメイン**：`integration_providers`、`integration_tokens`、`webhook_endpoints`。

> **留意**：MySQL はトランザクション整合性に優れるが、将来的なサービス分割時に DB 分離を想定し、テーブル命名やマイグレーション管理をモジュール単位で分離する。

## 5. フロントエンドとのインタラクション
- React（Next.js）でページ／API を整理。主画面例：
  - ダッシュボード（Reporting の API 呼び出し）
  - 取引一覧・入力フォーム（Accounting API）
  - 予算設定画面（Budgeting API）
  - 通知センター（Notifications API）
  - 設定画面（User/Integrations API）
- SWR/React Query 等を利用し、API レイヤーをドメイン単位で抽象化。OpenAPI 仕様から型生成し、バックエンドとの契約を明示。
- 認証状態の維持は Cookie ベースを推奨（CSRF 対策を Sanctum と連携）。フロント専用 BFF は現時点では不要。

## 6. 非機能要件（初期想定）
- **セキュリティ**：HTTPS 前提、OWASP ASVS ベースで検査。入力値バリデーション、レートリミット、2FA（将来）。
- **パフォーマンス**：主要 API の P95 < 300ms を目安。Redis キャッシュやインデックス設計を早期に検討。
- **可用性**：初期はシングルインスタンス（Docker Compose）だが、Dockerfile を ECS/Fargate 等に展開できる構成を用意。
- **監視**：リクエストログ、ジョブ失敗通知、エラートラッキング（Sentry 等）を初期段階で導入。
- **バックアップ**：MySQL は Daily Snapshot、添付ファイルはバージョニング付きストレージを利用。

## 7. 今後のアクション
1. このドメインマップをベースに、初期リリースで扱うユースケースの優先順位と MVP 範囲を決定。
2. OpenAPI 仕様書のドラフトを作成し、React クライアントとの契約を固める。
3. Laravel プロジェクトの初期セットアップ（Docker, Sail, テストフレームワーク、静的解析ツール）を実施。
4. モジュール構造とマイグレーション方針（命名規則、テーブル接頭辞等）をドキュメント化。

---
作成日：2025-10-23  
作成者：開発チーム（ドラフト）
