import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPanel } from "@/components/layout/PlaceholderPanel";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="レポート"
        description="期間別のサマリーやグラフを表示します。"
      />
      <PlaceholderPanel>レポート用のグラフやエクスポート機能をここに実装します。</PlaceholderPanel>
    </div>
  );
}
