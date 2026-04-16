import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import { Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

function formatScheduleDate(dateStr: string): string {
  const datePart = dateStr.split("T")[0];
  const date = new Date(datePart + "T00:00:00");
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[date.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
}

function getMonthLabel(dateStr: string): string {
  const datePart = dateStr.split("T")[0];
  const date = new Date(datePart + "T00:00:00");
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

export default async function AttendancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 내 참석 기록 — schedule 정보 포함
  const { data: attendances } = user
    ? await supabase
        .from("attendances")
        .select("status, schedules(id, title, date)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  type AttRow = { status: string; schedules: { id: string; title: string; date: string } | null };

  const rows = (attendances ?? []) as AttRow[];

  // 월별 그룹핑
  const monthMap = new Map<string, { date: string; status: string; title: string }[]>();
  for (const row of rows) {
    if (!row.schedules) continue;
    const label = getMonthLabel(row.schedules.date);
    if (!monthMap.has(label)) monthMap.set(label, []);
    monthMap.get(label)!.push({
      date: row.schedules.date,
      status: row.status,
      title: row.schedules.title,
    });
  }

  // 이번 달 참석 수
  const now = new Date();
  const thisMonthLabel = `${now.getFullYear()}년 ${now.getMonth() + 1}월`;
  const thisMonthRecords = monthMap.get(thisMonthLabel) ?? [];
  const thisMonthCount = thisMonthRecords.filter((r) => r.status === "attending").length;
  const thisMonthTotal = thisMonthRecords.length || 4;

  return (
    <>
      <PageHeader title="참석 현황" />

      <div className="px-4 py-5 space-y-4">
        {/* 이번 달 요약 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">
              <Calendar size={17} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">이번 달 참석</p>
              <p className="text-xs text-gray-400">{now.getMonth() + 1}월 기준</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: thisMonthTotal }).map((_, i) => (
              <div
                key={i}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg transition-all ${
                  i < thisMonthCount
                    ? "border-green-400 bg-green-50 shadow-sm"
                    : "border-gray-200 bg-gray-50 opacity-40"
                }`}
              >
                {i < thisMonthCount ? "🎤" : "○"}
              </div>
            ))}
            <span className="ml-1 text-xs text-gray-500">
              이번 달 <span className="font-bold text-green-600">{thisMonthCount}</span>/{thisMonthTotal}회
            </span>
          </div>
        </div>

        {/* 월별 내역 */}
        {monthMap.size === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-gray-400">참석 기록이 없어요</p>
          </div>
        ) : (
          Array.from(monthMap.entries()).map(([monthLabel, records]) => {
            const attendCount = records.filter((r) => r.status === "attending").length;
            return (
              <div key={monthLabel} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-800">{monthLabel}</p>
                  <span className="text-xs text-gray-400">
                    <span className="font-bold text-green-600">{attendCount}</span>회 참석
                  </span>
                </div>
                <div className="space-y-2">
                  {records.map((record, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"
                    >
                      <div>
                        <span className="text-sm text-gray-800">{formatScheduleDate(record.date)}</span>
                        <span className="text-xs text-gray-400 ml-2">{record.title}</span>
                      </div>
                      <Badge variant={record.status === "attending" ? "green" : "gray"}>
                        {record.status === "attending" ? "참석" : "불참"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
