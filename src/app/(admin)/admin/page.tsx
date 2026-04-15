import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CalendarDays, Users, CheckSquare, Music2 } from "lucide-react";

export default async function AdminPage() {
  const supabase = await createClient();

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
  const lastDay  = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];

  const [
    { count: memberCount },
    { count: scheduleCount },
    { count: attendanceCount },
    { count: songCount },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("schedules").select("*", { count: "exact", head: true }).gte("date", firstDay).lte("date", lastDay),
    supabase.from("attendances").select("*", { count: "exact", head: true }).eq("status", "attending"),
    supabase.from("songs").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "전체 회원", value: memberCount ?? 0, unit: "명", Icon: Users,        href: "/admin/members",    color: "bg-green-50 text-green-700 border-green-200" },
    { label: "이번 달 정모", value: scheduleCount ?? 0, unit: "회", Icon: CalendarDays, href: "/admin/schedules", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { label: "이번 달 참석", value: attendanceCount ?? 0, unit: "건", Icon: CheckSquare, href: "/admin/attendance", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { label: "등록된 곡",   value: songCount ?? 0, unit: "곡", Icon: Music2,       href: "/admin/songs",     color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  ];

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">대시보드</h2>
        <p className="text-sm text-gray-500 mt-0.5">길울림 운영 현황</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, unit, Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className={`rounded-2xl border p-4 ${color} hover:opacity-80 transition-opacity`}
          >
            <Icon size={20} className="mb-2" />
            <p className="text-2xl font-black">{value}<span className="text-sm font-normal ml-1">{unit}</span></p>
            <p className="text-xs font-medium mt-0.5 opacity-80">{label}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center text-sm text-gray-400">
        관리 항목을 선택하려면 상단 탭을 누르세요
      </div>
    </div>
  );
}
