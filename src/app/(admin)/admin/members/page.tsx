"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, ShieldCheck, User, Ban, MessageSquareOff, CheckCircle } from "lucide-react";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";

interface Member {
  id: string;
  name: string;
  real_name: string | null;
  email: string | null;
  role: "admin" | "member";
  part: string | null;
  age: number | null;
  location: string | null;
  available_days: string[] | null;
  instruments: string[] | null;
  preferred_genre: string[] | null;
  is_banned: boolean;
  is_chat_banned: boolean;
  created_at: string;
}

type UpdatingField = "role" | "ban" | "chat_ban" | null;

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<{ id: string; field: UpdatingField } | null>(null);
  const supabase = createClient();

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("users")
      .select("id, name, real_name, email, role, part, age, location, available_days, instruments, preferred_genre, is_banned, is_chat_banned, created_at")
      .order("created_at", { ascending: false });
    setMembers((data as Member[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  async function toggleField(member: Member, field: "role" | "is_banned" | "is_chat_banned") {
    const fieldKey: UpdatingField = field === "role" ? "role" : field === "is_banned" ? "ban" : "chat_ban";

    const labels: Record<string, string> = {
      role: member.role === "admin" ? "일반 멤버" : "관리자",
      is_banned: member.is_banned ? "차단 해제" : "차단",
      is_chat_banned: member.is_chat_banned ? "채팅 금지 해제" : "채팅 금지",
    };
    if (!confirm(`${member.name}님을 ${labels[field]}(으)로 변경할까요?`)) return;

    setUpdating({ id: member.id, field: fieldKey });

    if (field === "role") {
      const newRole = member.role === "admin" ? ("member" as const) : ("admin" as const);
      await supabase.from("users").update({ role: newRole }).eq("id", member.id);
      setMembers(prev => prev.map(m => m.id === member.id ? { ...m, role: newRole } : m));
    } else if (field === "is_banned") {
      const newVal = !member.is_banned;
      await supabase.from("users").update({ is_banned: newVal } as never).eq("id", member.id);
      setMembers(prev => prev.map(m => m.id === member.id ? { ...m, is_banned: newVal } : m));
    } else {
      const newVal = !member.is_chat_banned;
      await supabase.from("users").update({ is_chat_banned: newVal } as never).eq("id", member.id);
      setMembers(prev => prev.map(m => m.id === member.id ? { ...m, is_chat_banned: newVal } : m));
    }
    setUpdating(null);
  }

  const isUpdating = (id: string, field: UpdatingField) =>
    updating?.id === id && updating?.field === field;

  const filtered = members.filter(m =>
    search === "" ||
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">회원 관리</h2>
        <span className="text-xs text-gray-400">총 {members.length}명</span>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="이름 또는 이메일 검색"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>

      {loading ? (
        <div className="flex justify-center pt-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">해당하는 회원이 없어요</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((member) => (
            <div
              key={member.id}
              className={`rounded-2xl border bg-white p-4 shadow-sm ${member.is_banned ? "border-red-200 bg-red-50/30" : "border-gray-200"}`}
            >
              {/* 상단: 아바타 + 기본 정보 */}
              <div className="flex items-start gap-3 mb-3">
                <Avatar name={member.name ?? "?"} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{member.name}</span>
                    {member.real_name && (
                      <span className="text-xs text-gray-400">({member.real_name})</span>
                    )}
                    <Badge variant={member.role === "admin" ? "red" : "gray"}>
                      {member.role === "admin" ? "관리자" : "멤버"}
                    </Badge>
                    {member.is_banned && <Badge variant="red">차단됨</Badge>}
                    {member.is_chat_banned && <Badge variant="red">채팅금지</Badge>}
                  </div>
                  {/* Google 계정 이메일 */}
                  {member.email && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">📧 {member.email}</p>
                  )}
                  <div className="text-xs text-gray-400 mt-0.5 space-x-2">
                    {member.age && <span>{member.age}세</span>}
                    {member.location && <span>📍 {member.location}</span>}
                    {member.part && <span>🎵 {member.part}</span>}
                  </div>
                  {member.available_days && member.available_days.length > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">{member.available_days.join(" · ")}</p>
                  )}
                  {(!member.available_days || member.available_days.length === 0) && (
                    <p className="text-xs text-orange-400 mt-0.5">⚠️ 온보딩 미완료</p>
                  )}
                </div>
              </div>

              {/* 하단: 권한 버튼들 */}
              <div className="flex gap-2 flex-wrap border-t border-gray-100 pt-3">
                {/* 관리자/멤버 토글 */}
                <button
                  onClick={() => toggleField(member, "role")}
                  disabled={!!updating}
                  className={`flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-50 ${
                    member.role === "admin"
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {member.role === "admin" ? <User size={12} /> : <ShieldCheck size={12} />}
                  {isUpdating(member.id, "role") ? "..." : member.role === "admin" ? "멤버로" : "관리자로"}
                </button>

                {/* 채팅 금지 토글 */}
                <button
                  onClick={() => toggleField(member, "is_chat_banned")}
                  disabled={!!updating}
                  className={`flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-50 ${
                    member.is_chat_banned
                      ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {member.is_chat_banned ? <CheckCircle size={12} /> : <MessageSquareOff size={12} />}
                  {isUpdating(member.id, "chat_ban") ? "..." : member.is_chat_banned ? "채팅 허용" : "채팅 금지"}
                </button>

                {/* 블랙(계정 차단) 토글 */}
                <button
                  onClick={() => toggleField(member, "is_banned")}
                  disabled={!!updating}
                  className={`flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-50 ${
                    member.is_banned
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Ban size={12} />
                  {isUpdating(member.id, "ban") ? "..." : member.is_banned ? "차단 해제" : "블랙 (차단)"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
