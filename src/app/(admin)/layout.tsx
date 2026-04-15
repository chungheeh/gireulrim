"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Users, CheckSquare, Music2, Home } from "lucide-react";

const adminTabs = [
  { href: "/admin/schedules", label: "정모 관리", Icon: CalendarDays },
  { href: "/admin/members",   label: "회원 관리", Icon: Users },
  { href: "/admin/attendance",label: "참석 현황", Icon: CheckSquare },
  { href: "/admin/songs",     label: "선곡 확정", Icon: Music2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">⚙️ 관리자</span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Home size={13} />
          홈으로
        </Link>
      </header>

      {/* 관리자 탭 */}
      <nav className="sticky top-[53px] z-30 flex border-b border-gray-200 bg-white">
        {adminTabs.map(({ href, label, Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                isActive ? "border-b-2 border-green-600 text-green-700" : "text-gray-400"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* 페이지 컨텐츠 */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
