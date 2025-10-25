import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPanel } from "@/components/layout/PlaceholderPanel";

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="予算"
        description="カテゴリごとの予算設定と実績比較を行います。"
      />
      <PlaceholderPanel>月次予算フォームと進捗カードをここに追加します。</PlaceholderPanel>
    </div>
  );
}
