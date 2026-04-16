"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, CalendarDays, MapPin, Clock, Coins, X, Check } from "lucide-react";

interface Schedule {
  id: string;
  title: string;
  date: string;
  time: string | null;
  location: string | null;
  participation_fee: number;
  is_large_event: boolean;
  created_at: string;
}

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    participation_fee: "9000",
    is_large_event: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  function formatDate(dateStr: string): string {
    const datePart = dateStr.split("T")[0];
    const date = new Date(datePart + "T00:00:00");
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];
    return `${month}월 ${day}일 (${weekday})`;
  }

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("schedules")
      .select("*")
      .order("date", { ascending: false });
    setSchedules((data as Schedule[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchSchedules(); }, [fetchSchedules]);

  async function handleSave() {
    if (!form.title.trim() || !form.date) { setError("제목과 날짜는 필수입니다."); return; }
    setSaving(true); setError("");
    const { error: e } = await supabase.from("schedules").insert({
      title: form.title.trim(),
      date: form.date,
      time: form.time || null,
      location: form.location.trim() || null,
      participation_fee: parseInt(form.participation_fee) || 9000,
      is_large_event: form.is_large_event,
    });
    if (e) { setError(e.message); } else {
      setShowAdd(false);
      setForm({ title: "", date: "", time: "", location: "", participation_fee: "9000", is_large_event: false });
      fetchSchedules();
    }
    setSaving(false);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" 정모를 삭제할까요?`)) return;
    await supabase.from("schedules").delete().eq("id", id);
    fetchSchedules();
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">정모 관리</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
        >
          <Plus size={14} /> 정모 추가
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center pt-10"><div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" /></div>
      ) : schedules.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">등록된 정모가 없어요</div>
      ) : (
        <div className="space-y-3">
          {schedules.map((s) => (
            <div key={s.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-900">{s.title}</span>
                    {s.is_large_event && <span className="rounded-full bg-yellow-100 border border-yellow-300 px-2 py-0.5 text-[10px] font-bold text-yellow-700">대형 이벤트</span>}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <CalendarDays size={12} className="text-gray-400" />
                      {formatDate(s.date)}{s.time && ` ${s.time}`}
                    </div>
                    {s.location && <div className="flex items-center gap-1.5 text-xs text-gray-500"><MapPin size={12} className="text-gray-400" />{s.location}</div>}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Coins size={12} className="text-gray-400" />
                      {s.is_large_event ? "참가비 없음" : `${s.participation_fee.toLocaleString()}원`}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(s.id, s.title)} className="ml-2 rounded-lg p-2 text-red-400 hover:bg-red-50 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 추가 모달 */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-lg rounded-3xl bg-white max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center pt-4 pb-2"><div className="h-1 w-10 rounded-full bg-gray-200" /></div>
            <div className="flex items-center justify-between px-5 pb-3">
              <span className="font-bold text-gray-900">정모 추가</span>
              <button onClick={() => setShowAdd(false)} className="rounded-full p-1.5 hover:bg-gray-100"><X size={18} className="text-gray-500" /></button>
            </div>
            <div className="px-5 space-y-4">
              {[
                { label: "제목 *", key: "title", placeholder: "예: 5월 정기 합주", type: "text" },
                { label: "날짜 *", key: "date", placeholder: "", type: "date" },
                { label: "시간",   key: "time", placeholder: "", type: "time" },
                { label: "장소",   key: "location", placeholder: "예: 홍대 연습실", type: "text" },
                { label: "참가비 (원)", key: "participation_fee", placeholder: "9000", type: "number" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key as keyof typeof form] as string}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                </div>
              ))}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setForm(f => ({ ...f, is_large_event: !f.is_large_event }))}
                  className={`flex h-6 w-11 items-center rounded-full transition-colors ${form.is_large_event ? "bg-green-600" : "bg-gray-200"}`}
                >
                  <div className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${form.is_large_event ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
                <span className="text-sm text-gray-700">대형 이벤트 (버스킹 등, 참가비 없음)</span>
              </div>
              {error && <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
              <button onClick={handleSave} disabled={saving} className="w-full rounded-2xl bg-green-600 py-3.5 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60 transition-colors">
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
