"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import { Search, GraduationCap, X, Music2, Heart } from "lucide-react";

const PART_ICON: Record<string, string> = {
  보컬: "🎤",
  기타: "🎸",
  퍼커션: "🥁",
  키보드: "🎹",
};

const MOCK_MEMBERS = [
  {
    id: "1",
    name: "한충희",
    part: "기타",
    status: "소울 담긴 기타 · 8090 발라드",
    genres: ["8090 발라드", "어쿠스틱"],
    signature_song: "사랑했지만 — 김광석",
    vocal_range: null,
    bio: "퇴근 후 기타 한 곡으로 하루를 마무리합니다 🎸",
    can_give_lesson: false,
    is_me: true,
  },
  {
    id: "2",
    name: "솔아",
    part: "보컬",
    status: "잔잔한 어쿠스틱 좋아요 · 97년생",
    genres: ["어쿠스틱", "인디"],
    signature_song: "야생화 — 박효신",
    vocal_range: "고음",
    bio: "같이 듀엣 부르실 분 언제든 환영이에요!",
    can_give_lesson: true,
    is_me: false,
  },
  {
    id: "3",
    name: "버드나무",
    part: "보컬",
    status: "무반주도 좋아요 · 인디 감성",
    genres: ["인디", "어쿠스틱"],
    signature_song: "오래된 노래 — 잔나비",
    vocal_range: "중저음",
    bio: "노래하는 게 그냥 좋아서 왔습니다.",
    can_give_lesson: false,
    is_me: false,
  },
  {
    id: "4",
    name: "민준",
    part: "키보드",
    status: "반주 전문 · 편곡도 해드려요",
    genres: ["8090 발라드", "대중가요"],
    signature_song: "기억의 습작 — 토이",
    vocal_range: null,
    bio: "건반으로 분위기 만들어드립니다. 편곡 요청 환영!",
    can_give_lesson: true,
    is_me: false,
  },
  {
    id: "5",
    name: "지유",
    part: "보컬",
    status: "발라드 여왕 지망 · 하이노트 가능",
    genres: ["8090 발라드"],
    signature_song: "나의 사람아 — 이선희",
    vocal_range: "고음",
    bio: "좋아하는 아티스트: 이선희, 백지영",
    can_give_lesson: false,
    is_me: false,
  },
  {
    id: "6",
    name: "드림",
    part: "퍼커션",
    status: "리듬 담당 · 카혼 · 봉고",
    genres: ["대중가요", "인디"],
    signature_song: "봄날 — BTS",
    vocal_range: null,
    bio: "타악기로 분위기 살려드립니다 🥁",
    can_give_lesson: false,
    is_me: false,
  },
];

interface MemberDetailProps {
  member: (typeof MOCK_MEMBERS)[0];
  onClose: () => void;
}

function MemberDetail({ member, onClose }: MemberDetailProps) {
  const hasLessonButton = member.can_give_lesson && !member.is_me;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-t-3xl bg-white max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 드래그 핸들 (고정) */}
        <div className="shrink-0 flex justify-center pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>

        {/* 닫기 (고정) */}
        <div className="shrink-0 flex items-center justify-between px-5 pb-2">
          <span className="text-sm font-semibold text-gray-700">프로필</span>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* 스크롤 가능한 콘텐츠 */}
        <div className={`flex-1 overflow-y-auto px-5 py-2 space-y-5 ${!hasLessonButton ? "pb-[max(20px,env(safe-area-inset-bottom))]" : ""}`}>
          {/* 프로필 헤더 */}
          <div className="flex items-center gap-4">
            <Avatar name={member.name} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-bold text-gray-900">{member.name}</span>
                <span className="text-base">{PART_ICON[member.part]}</span>
                <Badge variant="green">{member.part}</Badge>
                {member.can_give_lesson && (
                  <Badge variant="purple">레슨 가능</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{member.status}</p>
            </div>
          </div>

          {/* 바이오 */}
          {member.bio && (
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3">
              {member.bio}
            </p>
          )}

          {/* 정보 그리드 */}
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
                  <span className="text-sm">🎤</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">음역대</p>
                  <p className="text-sm font-medium text-gray-800">{member.vocal_range}</p>
                </div>
              </div>
            )}
            {member.genres.length > 0 && (
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-50">
                  <Heart size={15} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">선호 장르</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {member.genres.map((g) => (
                      <Badge key={g} variant="yellow">{g}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 레슨 요청 버튼 (항상 하단 고정) */}
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

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<(typeof MOCK_MEMBERS)[0] | null>(null);

  const me = MOCK_MEMBERS.find((m) => m.is_me)!;
  const others = MOCK_MEMBERS.filter((m) => !m.is_me);

  const filtered = others.filter(
    (m) =>
      search === "" ||
      m.name.includes(search) ||
      m.part.includes(search) ||
      m.genres.some((g) => g.includes(search))
  );

  // 파트 순서 정렬: 보컬 → 기타 → 키보드 → 퍼커션
  const PART_ORDER = ["보컬", "기타", "키보드", "퍼커션"];
  const sorted = [...filtered].sort(
    (a, b) => PART_ORDER.indexOf(a.part) - PART_ORDER.indexOf(b.part)
  );

  return (
    <>
      <PageHeader title="멤버" subtitle={`길울림 ${MOCK_MEMBERS.length}명`} />

      <div className="px-4 py-4 space-y-4">
        {/* 내 프로필 (상단 크게) */}
        <div
          className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-4 cursor-pointer hover:border-green-300 transition-colors"
          onClick={() => setSelected(me)}
        >
          <div className="flex items-center gap-3">
            <Avatar name={me.name} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-gray-900">{me.name}</span>
                <span className="text-base">{PART_ICON[me.part]}</span>
                <Badge variant="green">{me.part}</Badge>
                <Badge variant="gray">나</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{me.status}</p>
              {me.signature_song && (
                <p className="text-xs text-gray-400 mt-1">
                  🎵 {me.signature_song}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 검색 */}
        <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="이름, 파트, 장르로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>

        {/* 포인트 레슨 배너 */}
        <div className="flex items-start gap-3 rounded-xl bg-purple-50 border border-purple-200 px-4 py-3">
          <GraduationCap size={18} className="text-purple-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-purple-700">포인트 레슨 가능</p>
            <p className="text-xs text-purple-600/80 mt-0.5">
              <span className="font-semibold">{MOCK_MEMBERS.filter((m) => m.can_give_lesson).length}명</span>의 멤버가 1:1 보컬 레슨을 제공합니다.
            </p>
          </div>
        </div>

        {/* 멤버 목록 */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
          {sorted.map((member) => (
            <button
              key={member.id}
              onClick={() => setSelected(member)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
            >
              <Avatar name={member.name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-semibold text-gray-900">{member.name}</span>
                  <span className="text-sm">{PART_ICON[member.part]}</span>
                  {member.can_give_lesson && (
                    <Badge variant="purple">레슨 가능</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{member.status}</p>
              </div>
              <span className="text-[11px] text-gray-300 shrink-0">{member.part}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 프로필 바텀 시트 */}
      {selected && (
        <MemberDetail member={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
