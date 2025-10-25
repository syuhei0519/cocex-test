import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPanel } from "@/components/layout/PlaceholderPanel";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="口座"
        description="銀行口座やカードの一覧を管理します。"
      />
      <PlaceholderPanel>口座の一覧テーブルと作成フォームをここに追加します。</PlaceholderPanel>
    </div>
  );
}
