"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { RefreshCw } from "lucide-react";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";

interface Schedule { id: string; title: string; date: string; time: string | null; }
interface AttendanceRow {
  id: string;
  status: "attending" | "absent" | "undecided";
  practice_note: string | null;
  users: { name: string; part: string | null; instruments: string[] | null } | null;
}

export default function AdminAttendancePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("schedules").select("id, title, date, time").order("date", { ascending: false }).then(({ data }) => {
      const list = (data as Schedule[]) ?? [];
      setSchedules(list);
      if (list.length > 0) setSelectedId(list[0].id);
    });
  }, [supabase]);

  const fetchAttendance = useCallback(async () => {
    if (!selectedId) return;
    setLoading(true);
    const { data } = await supabase
      .from("attendances")
      .select("id, status, practice_note, users(name, part, instruments)")
      .eq("schedule_id", selectedId);
    setRows((data as AttendanceRow[]) ?? []);
    setLoading(false);
  }, [selectedId, supabase]);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  const attending = rows.filter(r => r.status === "attending");
  const absent    = rows.filter(r => r.status === "absent");
  const undecided = rows.filter(r => r.status === "undecided");

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">참석 현황</h2>
        <button onClick={fetchAttendance} className="rounded-full p-2 hover:bg-gray-100 transition-colors">
          <RefreshCw size={16} className="text-gray-500" />
        </button>
      </div>

      {/* 일정 선택 */}
      <select
        value={selectedId}
        onChange={e => setSelectedId(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500"
      >
        {schedules.map(s => (
          <option key={s.id} value={s.id}>{s.date} {s.title}</option>
        ))}
      </select>

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "참석", count: attending.length, color: "bg-green-50 text-green-700 border-green-200" },
          { label: "불참", count: absent.length,    color: "bg-red-50 text-red-600 border-red-200" },
          { label: "미응답", count: undecided.length, color: "bg-gray-50 text-gray-500 border-gray-200" },
        ].map(({ label, count, color }) => (
          <div key={label} className={`rounded-2xl border px-3 py-3 text-center ${color}`}>
            <p className="text-xl font-black">{count}</p>
            <p className="text-xs font-medium">{label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center pt-6"><div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" /></div>
      ) : (
        <div className="space-y-2">
          {attending.length > 0 && (
            <p className="text-xs font-semibold text-gray-500 mt-4 mb-1">참석 예정 ({attending.length}명)</p>
          )}
          {attending.map(row => (
            <div key={row.id} className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
              <Avatar name={row.users?.name ?? "?"} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-gray-900">{row.users?.name ?? "알 수 없음"}</span>
                  {row.users?.part && <Badge variant="green">{row.users.part}</Badge>}
                </div>
                {row.practice_note && (
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">🎵 {row.practice_note}</p>
                )}
              </div>
              <Badge variant="green">참석</Badge>
            </div>
          ))}
          {absent.length > 0 && (
            <p className="text-xs font-semibold text-gray-500 mt-3 mb-1">불참 ({absent.length}명)</p>
          )}
          {absent.map(row => (
            <div key={row.id} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <Avatar name={row.users?.name ?? "?"} size="sm" />
              <span className="flex-1 text-sm text-gray-600">{row.users?.name ?? "알 수 없음"}</span>
              <Badge variant="gray">불참</Badge>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">아직 응답한 멤버가 없어요</div>
          )}
        </div>
      )}
    </div>
  );
}
