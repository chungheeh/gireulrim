"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Music2, Users, UserCircle2 } from "lucide-react";

const tabs = [
  { href: "/",        label: "홈",      Icon: Home        },
  { href: "/songs",   label: "선곡",    Icon: Music2      },
  { href: "/members", label: "멤버",    Icon: Users       },
  { href: "/mypage",  label: "MY",      Icon: UserCircle2 },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-stretch border-t border-gray-200 bg-white/95 backdrop-blur-md"
      style={{ paddingBottom: "var(--safe-area-bottom)" }}
    >
      {tabs.map(({ href, label, Icon }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors"
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.5 : 1.8}
              className={isActive ? "text-green-600" : "text-gray-400"}
            />
            <span className={`text-[10px] font-medium tracking-tight ${isActive ? "text-green-600" : "text-gray-400"}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
