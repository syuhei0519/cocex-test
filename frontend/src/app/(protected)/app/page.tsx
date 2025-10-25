import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPanel } from "@/components/layout/PlaceholderPanel";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="ダッシュボード"
        description="最近の取引と重要な指標をここから確認できます。"
      />
      <PlaceholderPanel>ウィジェットやチャートを追加するまでの仮置き領域です。</PlaceholderPanel>
    </div>
  );
}
