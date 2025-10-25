import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPanel } from "@/components/layout/PlaceholderPanel";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="取引"
        description="日々の収支を登録し、フィルターや検索で絞り込みます。"
      />
      <PlaceholderPanel>取引一覧テーブルと登録モーダルの実装をここに追加します。</PlaceholderPanel>
    </div>
  );
}
