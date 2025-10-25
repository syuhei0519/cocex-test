import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPanel } from "@/components/layout/PlaceholderPanel";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="カテゴリ"
        description="収支の分類ルールを整理し、レポートで利用します。"
      />
      <PlaceholderPanel>カテゴリの階層構造と編集モーダルをここで提供します。</PlaceholderPanel>
    </div>
  );
}
