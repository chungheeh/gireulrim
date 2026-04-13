"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mic2, ChevronRight } from "lucide-react";

const PARTS = ["보컬", "기타", "퍼커션", "키보드", "베이스"] as const;
const GENRES = ["8090 발라드", "어쿠스틱", "인디", "대중가요", "K-POP", "팝", "R&B", "재즈"] as const;
const VOCAL_RANGES = ["고음 (하이노트 가능)", "중고음", "중음", "중저음", "저음 (중후한 목소리)"] as const;

type Part = typeof PARTS[number];
type Genre = typeof GENRES[number];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    part: "" as Part | "",
    preferred_genre: [] as Genre[],
    vocal_range: "",
    signature_song: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleGenre(genre: Genre) {
    setForm((f) => ({
      ...f,
      preferred_genre: f.preferred_genre.includes(genre)
        ? f.preferred_genre.filter((g) => g !== genre)
        : [...f.preferred_genre, genre],
    }));
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.part) return;
    setLoading(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인 상태가 아닙니다.");

      const { error: upsertError } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          name: form.name.trim(),
          part: form.part,
          preferred_genre: form.preferred_genre,
          vocal_range: form.vocal_range,
          signature_song: form.signature_song.trim(),
          bio: form.bio.trim(),
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
      {/* 헤더 */}
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-600">
            <Mic2 size={15} className="text-white" />
          </div>
          <span className="font-bold text-gray-900">길울림 가입 정보</span>
        </div>
        {/* 스텝 인디케이터 */}
        <div className="mt-2 flex gap-1">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-green-600" : "bg-gray-100"}`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Step 1: 이름 + 파트 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">반가워요! 👋</h2>
              <p className="mt-1 text-sm text-gray-500">길울림에서 사용할 닉네임과 파트를 알려주세요.</p>
            </div>

            {/* 이름 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">닉네임 *</label>
              <input
                type="text"
                placeholder="예: 솔아, 버드나무, 홍길동"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* 파트 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">주 파트 *</label>
              <div className="grid grid-cols-3 gap-2">
                {PARTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setForm((f) => ({ ...f, part: p }))}
                    className={`rounded-xl border py-3 text-sm font-medium transition-all ${
                      form.part === p
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                  >
                    {p === "보컬" && "🎤 "}
                    {p === "기타" && "🎸 "}
                    {p === "퍼커션" && "🥁 "}
                    {p === "키보드" && "🎹 "}
                    {p === "베이스" && "🎵 "}
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: 장르 + 음역대 */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">음악 취향을 알려주세요 🎵</h2>
              <p className="mt-1 text-sm text-gray-500">비슷한 취향의 멤버를 쉽게 찾을 수 있어요.</p>
            </div>

            {/* 선호 장르 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">선호 장르 (복수 선택)</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                      form.preferred_genre.includes(g)
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                  >
                    {g}
                  </button>
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
                    onClick={() => setForm((f) => ({ ...f, vocal_range: r }))}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      form.vocal_range === r
                        ? "border-green-600 bg-green-50 text-green-700 font-medium"
                        : "border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: 18번 곡 + 자기소개 */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">거의 다 왔어요! 🎤</h2>
              <p className="mt-1 text-sm text-gray-500">멤버들과 친해질 수 있는 정보예요.</p>
            </div>

            {/* 18번 곡 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">18번 곡</label>
              <input
                type="text"
                placeholder="예: 이문세 - 가로수 그늘 아래 서면"
                value={form.signature_song}
                onChange={(e) => setForm((f) => ({ ...f, signature_song: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* 자기소개 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">한 줄 소개</label>
              <textarea
                placeholder="예: 잔잔한 발라드 좋아하는 직장인 보컬입니다 🎵"
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600">
                {error}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="sticky bottom-0 border-t border-gray-100 bg-white px-4 py-4" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}>
        {step < 3 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 1 && (!form.name.trim() || !form.part)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-4 text-sm font-bold text-white disabled:opacity-40 hover:bg-green-700 active:scale-95 transition-all"
          >
            다음 <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-2xl bg-green-600 py-4 text-sm font-bold text-white disabled:opacity-60 hover:bg-green-700 active:scale-95 transition-all"
          >
            {loading ? "저장 중..." : "길울림 시작하기 🎤"}
          </button>
        )}
        {step > 1 && (
          <button
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
