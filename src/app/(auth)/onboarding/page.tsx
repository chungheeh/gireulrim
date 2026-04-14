"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mic2, ChevronRight, Check } from "lucide-react";

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

// ─── 컴포넌트 ──────────────────────────────────────────
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
export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    // Step 1 — 기본 정보
    name: "",
    age: "",
    location: "",
    contact: "",
    // Step 2 — 모임 스타일
    available_days: [] as AvailableDay[],
    instruments: [] as Instrument[],
    // Step 3 — 음악 취향
    preferred_genre: [] as Genre[],
    vocal_range: "",
    signature_song: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 토글 헬퍼
  function toggleItem<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  }

  const step1Valid = form.name.trim().length >= 1;
  const step2Valid = form.available_days.length > 0;

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인 상태가 아닙니다.");

      const { error: upsertError } = await supabase.from("users").upsert({
        id: user.id,
        name: form.name.trim(),
        age: form.age ? parseInt(form.age) : null,
        location: form.location.trim() || null,
        contact: form.contact.trim() || null,
        available_days: form.available_days,
        instruments: form.instruments,
        preferred_genre: form.preferred_genre,
        vocal_range: form.vocal_range || null,
        signature_song: form.signature_song.trim() || null,
        bio: form.bio.trim() || null,
      });

      if (upsertError) throw upsertError;
      router.replace("/");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "오류가 발생했어요. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      {/* 헤더 + 스텝 인디케이터 */}
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-600">
            <Mic2 size={15} className="text-white" />
          </div>
          <span className="font-bold text-gray-900">길울림 가입 정보</span>
          <span className="ml-auto text-xs text-gray-400">{step} / 3</span>
        </div>
        <div className="mt-2.5 flex gap-1">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? "bg-green-600" : "bg-gray-100"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 폼 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">

        {/* ── Step 1: 기본 정보 ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">반가워요! 👋</h2>
              <p className="mt-1 text-sm text-gray-500">길울림에서 사용할 기본 정보를 입력해 주세요.</p>
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
              <input
                type="text"
                placeholder="예: 마포구, 성수동, 수원"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
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
              <p className="text-xs text-gray-400">운영진 확인용 · 다른 멤버에게 공개되지 않아요</p>
            </div>
          </div>
        )}

        {/* ── Step 2: 모임 날짜 + 악기 ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">모임 스타일을 알려주세요 📅</h2>
              <p className="mt-1 text-sm text-gray-500">일정 조율에 활용돼요.</p>
            </div>

            {/* 가능한 모임 날짜 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                가능한 모임 날짜 <span className="text-red-400">*</span>
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
        )}

        {/* ── Step 3: 음악 취향 + 18번 곡 ── */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">거의 다 왔어요! 🎤</h2>
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
        )}
      </div>

      {/* 하단 버튼 */}
      <div
        className="sticky bottom-0 border-t border-gray-100 bg-white px-4 py-4"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      >
        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 1 ? !step1Valid : !step2Valid}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-4 text-sm font-bold text-white disabled:opacity-40 hover:bg-green-700 active:scale-[0.98] transition-all"
          >
            다음 <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-2xl bg-green-600 py-4 text-sm font-bold text-white disabled:opacity-60 hover:bg-green-700 active:scale-[0.98] transition-all"
          >
            {loading ? "저장 중..." : "길울림 시작하기 🎤"}
          </button>
        )}
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="mt-2 w-full py-2 text-xs text-gray-400"
          >
            이전으로
          </button>
        )}
      </div>
    </div>
  );
}
