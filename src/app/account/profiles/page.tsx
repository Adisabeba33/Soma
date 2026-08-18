import { LoungePage } from "@/components/account/lounge-page";
import { ProfilesManager } from "@/components/account/profiles-manager";

export const metadata = { title: "Your profiles — SŌMA" };

export default function AccountProfilesPage() {
  return (
    <LoungePage
      eyebrow="Your profiles"
      title="Sensory profiles"
      intro="Each profile defines what SŌMA searches under. Switch the active one, or merge two to blend them."
    >
      <ProfilesManager />
    </LoungePage>
  );
}
