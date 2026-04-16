"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Check } from "lucide-react";

// ─── 상수 ───────────────────────────────────────────────
const INSTRUMENTS = [
  { label: "없음 (보컬 전용)", icon: "🎤" },
  { label: "기타", icon: "🎸" },
  { label: "베이스", icon: "🎵" },
  { label: "키보드 / 피아노", icon: "🎹" },
  { label: "드럼 / 퍼커션", icon: "🥁" },
  { label: "우쿨렐레", icon: "🪗" },
  { label: "바이올린", icon: "🎻" },
  { label: "기타 악기", icon: "🎶" },
] as const;

const AVAILABLE_DAYS = [
  { label: "평일 저녁", desc: "월~금 저녁", icon: "🌆" },
  { label: "주말 저녁", desc: "토·일 저녁", icon: "🌇" },
  { label: "주말 낮", desc: "토·일 오후", icon: "☀️" },
] as const;

const GENRES = ["8090 발라드", "어쿠스틱", "인디", "대중가요", "K-POP", "팝", "R&B", "재즈"] as const;
const VOCAL_RANGES = [
  "고음 (하이노트 가능)",
  "중고음",
  "중음",
  "중저음",
  "저음 (중후한 목소리)",
] as const;

type Instrument = typeof INSTRUMENTS[number]["label"];
type AvailableDay = typeof AVAILABLE_DAYS[number]["label"];
type Genre = typeof GENRES[number];

// ─── 서브 컴포넌트 ──────────────────────────────────────
function ToggleChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
        selected
          ? "border-green-600 bg-green-600 text-white shadow-sm"
          : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
      }`}
    >
      {selected && <Check size={13} className="shrink-0" />}
      {children}
    </button>
  );
}

// ─── 메인 ──────────────────────────────────────────────
export default function MyPageEditPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    name: "",
    age: "",
    location_city: "서울",
    location_gu: "",
    location_station: "",
    contact: "",
    available_days: [] as AvailableDay[],
    instruments: [] as Instrument[],
    preferred_genre: [] as Genre[],
    vocal_range: "",
    signature_song: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");

  // 초기 데이터 로드
  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace("/login");
          return;
        }
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          const locParts = ((data as Record<string, unknown>).location as string ?? "").split(" ");
          const CITIES = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
          const cityPart = CITIES.includes(locParts[0]) ? locParts[0] : "서울";
          const rest = CITIES.includes(locParts[0]) ? locParts.slice(1) : locParts;
          setForm({
            name: data.name ?? "",
            age: data.age != null ? String(data.age) : "",
            location_city: cityPart,
            location_gu: rest[0] ?? "",
            location_station: rest[1] ?? "",
            contact: (data as Record<string, unknown>).contact as string ?? "",
            available_days: ((data as Record<string, unknown>).available_days as AvailableDay[]) ?? [],
            instruments: ((data as Record<string, unknown>).instruments as Instrument[]) ?? [],
            preferred_genre: (data.preferred_genre as Genre[]) ?? [],
            vocal_range: (data as Record<string, unknown>).vocal_range as string ?? "",
            signature_song: data.signature_song ?? "",
            bio: (data as Record<string, unknown>).bio as string ?? "",
          });
        }
      } catch {
        // 로드 실패 시 빈 폼으로 진행
      } finally {
        setInitializing(false);
      }
    }
    loadProfile();
  }, [supabase, router]);

  function toggleItem<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  }

  async function handleSave() {
    setLoading(true);
    setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인 상태가 아닙니다.");

      const { error: updateError } = await supabase.from("users").update({
        name: form.name.trim(),
        age: form.age ? parseInt(form.age) : null,
        location: [form.location_city, form.location_gu.trim(), form.location_station.trim()].filter(Boolean).join(" ") || null,
        contact: form.contact.trim() || null,
        available_days: form.available_days,
        instruments: form.instruments,
        preferred_genre: form.preferred_genre,
        vocal_range: form.vocal_range || null,
        signature_song: form.signature_song.trim() || null,
        bio: form.bio.trim() || null,
      }).eq("id", user.id);

      if (updateError) throw updateError;
      router.replace("/mypage");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "저장 중 오류가 발생했어요. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  if (initializing) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white">
        <p className="text-sm text-gray-400">프로필 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} />
            뒤로
          </button>
          <span className="font-bold text-gray-900">프로필 수정</span>
        </div>
      </div>

      {/* 폼 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">

        {/* 기본 정보 */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">기본 정보</h2>
            <p className="mt-1 text-sm text-gray-500">길울림에서 사용하는 정보예요.</p>
          </div>

          {/* 이름 */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              이름 (닉네임) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="예: 솔아, 버드나무, 홍길동"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500 transition-all"
            />
          </div>

          {/* 나이 */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">나이</label>
            <input
              type="number"
              placeholder="예: 28"
              value={form.age}
              onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500 transition-all"
            />
          </div>

          {/* 사는 곳 */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">사는 곳</label>
            <div className="flex gap-2">
              <select
                value={form.location_city}
                onChange={(e) => setForm((f) => ({ ...f, location_city: e.target.value }))}
                className="w-28 shrink-0 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500 transition-all"
              >
                {["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="구 (예: 마포구)"
                value={form.location_gu}
                onChange={(e) => setForm((f) => ({ ...f, location_gu: e.target.value }))}
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500 transition-all"
              />
            </div>
            <input
              type="text"
              placeholder="가까운 역 (예: 합정역)"
              value={form.location_station}
              onChange={(e) => setForm((f) => ({ ...f, location_station: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500 transition-all"
            />
          </div>

          {/* 연락처 */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">연락처</label>
            <input
              type="tel"
              placeholder="예: 010-1234-5678"
              value={form.contact}
              onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500 transition-all"
            />
            <p className="text-xs text-gray-400">다른 멤버에게 공개되지 않아요</p>
          </div>
        </div>

        {/* 모임 날짜 + 악기 */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">모임 스타일</h2>
            <p className="mt-1 text-sm text-gray-500">일정 조율에 활용돼요.</p>
          </div>

          {/* 가능한 모임 날짜 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              가능한 모임 날짜
              <span className="ml-1 text-xs font-normal text-gray-400">(복수 선택)</span>
            </label>
            <div className="space-y-2">
              {AVAILABLE_DAYS.map(({ label, desc, icon }) => {
                const selected = form.available_days.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        available_days: toggleItem(f.available_days, label),
                      }))
                    }
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                      selected
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xl">{icon}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${selected ? "text-green-700" : "text-gray-800"}`}>
                        {label}
                      </p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                        selected ? "border-green-600 bg-green-600" : "border-gray-300"
                      }`}
                    >
                      {selected && <Check size={11} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 다룰 줄 아는 악기 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              다룰 줄 아는 악기
              <span className="ml-1 text-xs font-normal text-gray-400">(복수 선택)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {INSTRUMENTS.map(({ label, icon }) => (
                <ToggleChip
                  key={label}
                  selected={form.instruments.includes(label)}
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      instruments: toggleItem(f.instruments, label),
                    }))
                  }
                >
                  {icon} {label}
                </ToggleChip>
              ))}
            </div>
          </div>
        </div>

        {/* 음악 취향 */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">음악 취향</h2>
            <p className="mt-1 text-sm text-gray-500">음악 취향을 알면 더 재밌어져요.</p>
          </div>

          {/* 선호 장르 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              선호 장르
              <span className="ml-1 text-xs font-normal text-gray-400">(복수 선택)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <ToggleChip
                  key={g}
                  selected={form.preferred_genre.includes(g)}
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      preferred_genre: toggleItem(f.preferred_genre, g),
                    }))
                  }
                >
                  {g}
                </ToggleChip>
              ))}
            </div>
          </div>

          {/* 음역대 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">음역대</label>
            <div className="space-y-2">
              {VOCAL_RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, vocal_range: r }))}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                    form.vocal_range === r
                      ? "border-green-600 bg-green-50 text-green-700 font-semibold"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  {r}
                  {form.vocal_range === r && <Check size={15} className="text-green-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* 18번 곡 */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">18번 곡</label>
            <input
              type="text"
              placeholder="예: 이문세 - 가로수 그늘 아래 서면"
              value={form.signature_song}
              onChange={(e) => setForm((f) => ({ ...f, signature_song: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500 transition-all"
            />
          </div>

          {/* 한 줄 소개 */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">한 줄 소개</label>
            <textarea
              placeholder="예: 잔잔한 발라드 좋아하는 직장인 보컬입니다 🎵"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500 resize-none transition-all"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* 하단 저장 버튼 */}
      <div
        className="sticky bottom-0 border-t border-gray-100 bg-white px-4 py-4"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      >
        <button
          type="button"
          onClick={handleSave}
          disabled={loading || form.name.trim().length < 1}
          className="w-full rounded-2xl bg-green-600 py-4 text-sm font-bold text-white disabled:opacity-40 hover:bg-green-700 active:scale-[0.98] transition-all"
        >
          {loading ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </div>
  );
}
