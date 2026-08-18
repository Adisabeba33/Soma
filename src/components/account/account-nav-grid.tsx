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

// Where everything in the lounge lives. Every entry opens a page of its
// own — the four lounge sub-pages under /account, and the member surfaces
// the app already serves — and every one of those pages carries a back
// control to this hub.
const ITEMS = [
  {
    href: "/account/profiles",
    title: "Your profiles",
    subtitle: "Manage your taste profiles",
    Icon: UserRound,
  },
  {
    href: "/account/blender",
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
    href: "/account/privacy",
    title: "Privacy & data",
    subtitle: "Control your information",
    Icon: ShieldCheck,
  },
  {
    href: "/account/settings",
    title: "Settings",
    subtitle: "Preferences & account",
    Icon: Settings,
  },
  {
    href: "/account/help",
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
