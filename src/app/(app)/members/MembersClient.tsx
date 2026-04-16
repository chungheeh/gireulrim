"use client";

import { useState } from "react";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import { Search, GraduationCap, X, Music2, Heart, Mic2 } from "lucide-react";

export interface Member {
  id: string;
  name: string;
  instruments: string[] | null;
  preferred_genre: string[] | null;
  vocal_range: string | null;
  signature_song: string | null;
  bio: string | null;
  can_give_lesson: boolean;
  age: number | null;
  location: string | null;
  available_days: string[] | null;
  role: string | null;
}

function getInstrumentIcon(instruments: string[] | null): string {
  if (!instruments || instruments.length === 0) return "🎤";
  const first = instruments[0];
  if (first.includes("기타")) return "🎸";
  if (first.includes("베이스")) return "🎵";
  if (first.includes("키보드") || first.includes("피아노")) return "🎹";
  if (first.includes("드럼") || first.includes("퍼커션")) return "🥁";
  if (first.includes("우쿨렐레")) return "🪗";
  if (first.includes("바이올린")) return "🎻";
  return "🎤";
}

function getMainLabel(instruments: string[] | null): string {
  if (!instruments || instruments.length === 0 || instruments[0].includes("없음")) return "보컬";
  const first = instruments[0];
  if (first.includes("키보드") || first.includes("피아노")) return "키보드";
  if (first.includes("드럼") || first.includes("퍼커션")) return "퍼커션";
  if (first.includes("기타")) return "기타";
  if (first.includes("베이스")) return "베이스";
  if (first.includes("우쿨렐레")) return "우쿨렐레";
  if (first.includes("바이올린")) return "바이올린";
  return "보컬";
}

interface MemberDetailProps {
  member: Member;
  isMe: boolean;
  onClose: () => void;
}

function MemberDetail({ member, isMe, onClose }: MemberDetailProps) {
  const hasLessonButton = member.can_give_lesson && !isMe;
  const icon = getInstrumentIcon(member.instruments);
  const label = getMainLabel(member.instruments);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-3xl bg-white max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 드래그 핸들 */}
        <div className="shrink-0 flex justify-center pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>

        {/* 헤더 */}
        <div className="shrink-0 flex items-center justify-between px-5 pb-2">
          <span className="text-sm font-semibold text-gray-700">프로필</span>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* 스크롤 콘텐츠 */}
        <div className={`flex-1 overflow-y-auto px-5 py-2 space-y-5 ${!hasLessonButton ? "pb-[max(20px,env(safe-area-inset-bottom))]" : ""}`}>
          {/* 프로필 헤더 */}
          <div className="flex items-center gap-4">
            <Avatar name={member.name} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-bold text-gray-900">{member.name}</span>
                <span className="text-base">{icon}</span>
                <Badge variant="green">{label}</Badge>
                {member.role === "admin" && <Badge variant="yellow">모임장</Badge>}
                {isMe && <Badge variant="gray">나</Badge>}
                {member.can_give_lesson && <Badge variant="purple">레슨 가능</Badge>}
              </div>
              {member.age && (
                <p className="text-sm text-gray-500 mt-0.5">{member.age}세 · {member.location ?? ""}</p>
              )}
            </div>
          </div>

          {/* 바이오 */}
          {member.bio && (
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3">
              {member.bio}
            </p>
          )}

          {/* 정보 */}
          <div className="space-y-2.5">
            {member.signature_song && (
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50">
                  <Music2 size={15} className="text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">18번 곡</p>
                  <p className="text-sm font-medium text-gray-800">{member.signature_song}</p>
                </div>
              </div>
            )}
            {member.vocal_range && (
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                  <Mic2 size={15} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">음역대</p>
                  <p className="text-sm font-medium text-gray-800">{member.vocal_range}</p>
                </div>
              </div>
            )}
            {member.preferred_genre && member.preferred_genre.length > 0 && (
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-50">
                  <Heart size={15} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">선호 장르</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {member.preferred_genre.map((g) => (
                      <Badge key={g} variant="yellow">{g}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {member.available_days && member.available_days.length > 0 && (
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50">
                  <span className="text-sm">📅</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">가능한 모임 날짜</p>
                  <p className="text-sm font-medium text-gray-800">{member.available_days.join(", ")}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 레슨 요청 버튼 */}
        {hasLessonButton && (
          <div className="shrink-0 border-t border-gray-100 px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]">
            <button className="w-full rounded-2xl bg-purple-600 py-3.5 text-sm font-bold text-white hover:bg-purple-700 transition-colors">
              <GraduationCap size={16} className="inline mr-1.5 -mt-0.5" />
              포인트 레슨 요청하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface MembersClientProps {
  members: Member[];
  currentUserId: string | undefined;
}

export default function MembersClient({ members, currentUserId }: MembersClientProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Member | null>(null);

  const me = members.find((m) => m.id === currentUserId);
  const others = members.filter((m) => m.id !== currentUserId);

  const filtered = others.filter(
    (m) =>
      search === "" ||
      m.name.includes(search) ||
      (m.preferred_genre ?? []).some((g) => g.includes(search)) ||
      (m.instruments ?? []).some((i) => i.includes(search))
  );

  return (
    <>
      <div className="px-4 py-4 space-y-4">
        {/* 내 프로필 */}
        {me && (
          <div
            className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-4 cursor-pointer hover:border-green-300 transition-colors"
            onClick={() => setSelected(me)}
          >
            <div className="flex items-center gap-3">
              <Avatar name={me.name} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-gray-900">{me.name}</span>
                  <span className="text-base">{getInstrumentIcon(me.instruments)}</span>
                  <Badge variant="green">{getMainLabel(me.instruments)}</Badge>
                  {me.role === "admin" && <Badge variant="yellow">모임장</Badge>}
                  <Badge variant="gray">나</Badge>
                </div>
                {me.bio && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{me.bio}</p>}
                {me.signature_song && (
                  <p className="text-xs text-gray-400 mt-1">🎵 {me.signature_song}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 검색 */}
        <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="이름, 장르, 악기로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>

        {/* 레슨 가능 배너 */}
        {members.some((m) => m.can_give_lesson) && (
          <div className="flex items-start gap-3 rounded-xl bg-purple-50 border border-purple-200 px-4 py-3">
            <GraduationCap size={18} className="text-purple-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-purple-700">포인트 레슨 가능</p>
              <p className="text-xs text-purple-600/80 mt-0.5">
                <span className="font-semibold">{members.filter((m) => m.can_give_lesson).length}명</span>의 멤버가 1:1 보컬 레슨을 제공합니다.
              </p>
            </div>
          </div>
        )}

        {/* 멤버 목록 */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-gray-400">검색 결과가 없어요</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
            {filtered.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelected(member)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
              >
                <Avatar name={member.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{member.name}</span>
                    <span className="text-sm">{getInstrumentIcon(member.instruments)}</span>
                    {member.role === "admin" && <Badge variant="yellow">모임장</Badge>}
                    {member.can_give_lesson && <Badge variant="purple">레슨 가능</Badge>}
                  </div>
                  {member.bio ? (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{member.bio}</p>
                  ) : member.preferred_genre && member.preferred_genre.length > 0 ? (
                    <p className="text-xs text-gray-400 mt-0.5">{member.preferred_genre.slice(0, 2).join(" · ")}</p>
                  ) : null}
                </div>
                <span className="text-[11px] text-gray-300 shrink-0">{getMainLabel(member.instruments)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <MemberDetail
          member={selected}
          isMe={selected.id === currentUserId}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
