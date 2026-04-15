"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AddSongSheetProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

type TagType = "솔로" | "듀엣 모집" | "단체곡";

const TAGS: TagType[] = ["솔로", "듀엣 모집", "단체곡"];

export default function AddSongSheet({ open, onClose, onAdded }: AddSongSheetProps) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [tag, setTag] = useState<TagType>("솔로");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [songKey, setSongKey] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSave = async () => {
    if (!title.trim() || !artist.trim()) {
      setError("곡 제목과 아티스트는 필수입니다.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("로그인이 필요합니다.");
        return;
      }

      const { error: insertError } = await supabase.from("songs").insert({
        title: title.trim(),
        artist: artist.trim(),
        tag,
        youtube_url: youtubeUrl.trim() || null,
        song_key: songKey.trim() || null,
        lyrics: lyrics.trim() || null,
        user_id: user.id,
        is_busking_selected: false,
      });

      if (insertError) {
        setError("저장 중 오류가 발생했습니다: " + insertError.message);
        return;
      }

      // 초기화
      setTitle("");
      setArtist("");
      setTag("솔로");
      setYoutubeUrl("");
      setSongKey("");
      setLyrics("");

      onAdded();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* 딤 배경 */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      {/* 바텀시트 — flex 컬럼으로 구조화해 버튼을 항상 하단 고정 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-white rounded-t-3xl max-h-[90vh]">
        {/* 드래그 핸들 + 헤더 (고정) */}
        <div className="shrink-0">
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-gray-300" />
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <h2 className="text-base font-bold text-gray-900">곡 추가</h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="닫기"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* 입력 폼 (스크롤 가능) */}
        <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4">
          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>
          )}

          {/* 곡 제목 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              곡 제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="곡 제목을 입력하세요"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
            />
          </div>

          {/* 아티스트 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              아티스트 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="아티스트명을 입력하세요"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
            />
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">태그</label>
            <div className="flex gap-2">
              {TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition-colors ${
                    tag === t
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 유튜브 URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">유튜브 URL</label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtu.be/..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
            />
          </div>

          {/* 키 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">키</label>
            <input
              type="text"
              value={songKey}
              onChange={(e) => setSongKey(e.target.value)}
              placeholder="예: C, G, Am"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
            />
          </div>

          {/* 가사 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">가사</label>
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              rows={6}
              placeholder="가사를 입력하세요"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400 resize-none"
            />
          </div>
        </div>

        {/* 저장 버튼 (항상 하단 고정) */}
        <div className="shrink-0 border-t border-gray-100 px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </div>
    </>
  );
}
