import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPanel } from "@/components/layout/PlaceholderPanel";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="設定"
        description="プロフィールや言語設定、通知の好みを変更します。"
      />
      <PlaceholderPanel>プロフィール編集フォームや通知設定をここに配置します。</PlaceholderPanel>
    </div>
  );
}
