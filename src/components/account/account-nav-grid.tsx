import {
  BookOpen,
  Archive,
  CircleHelp,
  Info,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { AccountNavItem } from "@/components/account/account-nav-item";

// Where everything in the lounge lives. Each entry points at an existing
// destination — a route the app already serves, a section further down this
// page, or the support mailbox published in the privacy policy. No new
// surfaces were invented for the grid.
const SUPPORT_EMAIL = "Somasensory@somasensory.com";

const ITEMS = [
  {
    href: "#profiles",
    title: "Your profiles",
    subtitle: "Manage your taste profiles",
    Icon: UserRound,
  },
  {
    href: "#blender",
    title: "Taste blender",
    subtitle: "Craft the perfect blend",
    Icon: Sparkles,
  },
  {
    href: "/collection",
    title: "Your shelf",
    subtitle: "Every strain you've tried",
    Icon: Archive,
  },
  {
    href: "/saved",
    title: "Your reads",
    subtitle: "Past Taste Match runs",
    Icon: BookOpen,
  },
  {
    href: "/privacy",
    title: "Privacy & data",
    subtitle: "Control your information",
    Icon: ShieldCheck,
  },
  {
    href: "#settings",
    title: "Settings",
    subtitle: "Preferences & account",
    Icon: Settings,
  },
  {
    href: `mailto:${SUPPORT_EMAIL}`,
    title: "Help & support",
    subtitle: "Get help when you need it",
    Icon: CircleHelp,
  },
  {
    href: "/about",
    title: "About SŌMA",
    subtitle: "Our story & mission",
    Icon: Info,
  },
];

export function AccountNavGrid() {
  return (
    <nav aria-label="Account sections" className="mt-5">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <li key={item.href}>
            <AccountNavItem {...item} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
