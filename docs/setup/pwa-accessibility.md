# PWA / アクセシビリティ設定メモ

## 1. PWA
- `public/manifest.json` を追加し、アプリ名・配色・アイコンパスを定義。アイコンは `public/icons/icon-192.png` / `icon-512.png`（プレースホルダー）を用意。
- `public/sw.js` にシンプルな service worker を配置。将来的にキャッシュ戦略を実装する。
- `src/app/sw-register.tsx` で production 時のみ service worker を登録。
- `metadata` に `manifest` / `themeColor` を設定済み（`src/app/layout.tsx`）。

起動確認:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api npm run build
npm run start
# ブラウザでアプリを開き、Application > Manifest / Service Workers で確認
```

## 2. アクセシビリティ検証
- 開発時に `@axe-core/react` が自動で読み込まれ、コンソールにアクセシビリティ警告を出力（`src/app/providers.tsx` 参照）。
- `eslint-config-next` 由来の `jsx-a11y` ルールに加え、Prettier/ESLint の整形で import 順・hooks ルールを強制。
- 将来的に CI で `npm run lint` や `npm run test` を実行することで静的チェック・RTL テストと組み合わせ可能。

## 3. 今後の拡張案
- Workbox 等を利用した precache/Runtime キャッシュの導入。
- PWA アイコン・スプラッシュ画像の本番用デザイン差し替え。
- Axe レポートの CI 出力、`@axe-core/playwright` を併用した E2E レベルでの検証。
- Lighthouse CI を導入し、PWA/A11y スコアを自動監視。
