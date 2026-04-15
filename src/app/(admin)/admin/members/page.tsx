"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, ShieldCheck, User } from "lucide-react";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";

interface Member {
  id: string;
  name: string;
  role: "admin" | "member";
  part: string | null;
  age: number | null;
  location: string | null;
  available_days: string[] | null;
  instruments: string[] | null;
  preferred_genre: string[] | null;
  created_at: string;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const supabase = createClient();

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("users")
      .select("id, name, role, part, age, location, available_days, instruments, preferred_genre, created_at")
      .order("created_at", { ascending: false });
    setMembers((data as Member[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  async function toggleRole(member: Member) {
    if (!confirm(`${member.name}님의 역할을 ${member.role === "admin" ? "일반 멤버" : "관리자"}로 변경할까요?`)) return;
    setUpdating(member.id);
    const newRole = member.role === "admin" ? "member" : "admin";
    await supabase.from("users").update({ role: newRole }).eq("id", member.id);
    setMembers(prev => prev.map(m => m.id === member.id ? { ...m, role: newRole } : m));
    setUpdating(null);
  }

  const filtered = members.filter(m =>
    search === "" || m.name?.toLowerCase().includes(search.toLowerCase())
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
          placeholder="이름으로 검색"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>

      {loading ? (
        <div className="flex justify-center pt-10"><div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">해당하는 회원이 없어요</div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((member) => (
            <div key={member.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar name={member.name ?? "?"} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{member.name}</span>
                    <Badge variant={member.role === "admin" ? "red" : "gray"}>
                      {member.role === "admin" ? "관리자" : "멤버"}
                    </Badge>
                  </div>
                  <div className="mt-0.5 text-xs text-gray-400 space-y-0.5">
                    {member.age && <span className="mr-2">{member.age}세</span>}
                    {member.location && <span className="mr-2">📍 {member.location}</span>}
                    {member.available_days && member.available_days.length > 0 && (
                      <div className="text-xs text-gray-400">{member.available_days.join(" · ")}</div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleRole(member)}
                  disabled={updating === member.id}
                  className={`flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-50 ${
                    member.role === "admin"
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {member.role === "admin" ? <User size={13} /> : <ShieldCheck size={13} />}
                  {updating === member.id ? "..." : member.role === "admin" ? "멤버로" : "관리자로"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
