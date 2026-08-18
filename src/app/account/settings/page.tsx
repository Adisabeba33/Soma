import { LoungePage } from "@/components/account/lounge-page";
import { AccountSettingsPanel } from "@/components/account/account-settings-panel";

export const metadata = { title: "Settings — SŌMA" };

export default function AccountSettingsPage() {
  return (
    <LoungePage
      eyebrow="Settings"
      title="Preferences & account"
      intro="Who you're signed in as, and the way out."
    >
      <AccountSettingsPanel />
    </LoungePage>
  );
}
