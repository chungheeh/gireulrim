"use client";

import { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import LyricsModal from "@/components/LyricsModal";
import AddSongSheet from "@/components/AddSongSheet";
import { createClient } from "@/lib/supabase/client";
import { Plus, Search, Play, FileText, Music2, Star } from "lucide-react";

// 파트별 아이콘
const PART_ICON: Record<string, string> = {
  보컬: "🎤",
  기타: "🎸",
  퍼커션: "🥁",
  키보드: "🎹",
};

interface Song {
  id: string;
  title: string;
  artist: string;
  youtube_url: string | null;
  lyrics: string | null;
  song_key: string | null;
  tag: string;
  user_id: string;
  is_busking_selected: boolean;
  created_at: string;
  users: { name: string; part: string | null } | null;
}

type Filter = "전체" | "솔로" | "듀엣 모집" | "단체곡" | "버스킹 확정";

const TAG_BADGE: Record<string, "green" | "purple" | "yellow" | "gray"> = {
  솔로: "green",
  "듀엣 모집": "purple",
  단체곡: "yellow",
};

function formatDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}주 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

// YouTube 썸네일 컴포넌트
function YoutubeThumbnail({ url, title }: { url: string | null; title: string }) {
  const videoId = url ? extractYoutubeId(url) : null;
  const thumbUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : null;

  if (thumbUrl) {
    return (
      <div className="relative h-[68px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-gray-200">
        <img
          src={thumbUrl}
          alt={title}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow">
            <Play size={14} className="text-gray-800 ml-0.5" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative h-[68px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
      <Music2 size={28} className="text-gray-400" />
    </div>
  );
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function SongsPage() {
  const [filter, setFilter] = useState<Filter>("전체");
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [lyricsTarget, setLyricsTarget] = useState<Song | null>(null);

  const filters: Filter[] = ["전체", "솔로", "듀엣 모집", "단체곡", "버스킹 확정"];

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("songs")
        .select("*, users(name, part)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setSongs(data as Song[]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const filtered = songs.filter((s) => {
    const matchTag =
      filter === "전체"
        ? true
        : filter === "버스킹 확정"
        ? s.is_busking_selected
        : s.tag === filter;
    const matchSearch =
      search === "" || s.title.includes(search) || s.artist.includes(search);
    return matchTag && matchSearch;
  });

  return (
    <>
      <PageHeader
        title="선곡 / 연습"
        subtitle="MR · 가사 · 유튜브 링크"
        action={
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
          >
            <Plus size={14} />
            곡 추가
          </button>
        }
      />

      <div className="px-4 py-4 space-y-3">
        {/* 검색 */}
        <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="곡명 또는 아티스트 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>

        {/* 필터 태그 */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                filter === tag
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 로딩 */}
        {loading ? (
          <div className="flex justify-center pt-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          /* 빈 상태 */
          <div className="flex flex-col items-center justify-center pt-16 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-5">
              <Music2 size={36} className="text-gray-300" />
            </div>
            <p className="text-base font-medium text-gray-700">해당하는 곡이 없어요</p>
            <p className="mt-1 text-sm text-gray-400">곡을 추가하거나 필터를 변경해 보세요 🎵</p>
          </div>
        ) : (
          /* 곡 목록 */
          <div className="space-y-2.5">
            {filtered.map((song) => (
              <div
                key={song.id}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
              >
                {/* 버스킹 확정 배너 */}
                {song.is_busking_selected && (
                  <div className="flex items-center gap-1.5 bg-yellow-500 px-3 py-1.5">
                    <Star size={11} className="text-yellow-900 fill-yellow-900" />
                    <span className="text-[11px] font-bold text-yellow-900">
                      버스킹 확정 셋리스트
                    </span>
                  </div>
                )}

                <div className="p-3.5">
                  <div className="flex gap-3">
                    {/* 썸네일 */}
                    <YoutubeThumbnail url={song.youtube_url} title={song.title} />

                    {/* 곡 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Badge variant={TAG_BADGE[song.tag] ?? "gray"}>{song.tag}</Badge>
                        {song.song_key && (
                          <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-1 py-0.5">
                            Key {song.song_key}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-gray-900 leading-tight line-clamp-1">
                        {song.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{song.artist}</p>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex items-center gap-2 mt-3">
                    <a
                      href={song.youtube_url ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-disabled={!song.youtube_url}
                      onClick={(e) => { if (!song.youtube_url) e.preventDefault(); }}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-colors ${
                        song.youtube_url
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-gray-50 text-gray-300 cursor-not-allowed pointer-events-none"
                      }`}
                    >
                      <Play size={13} />
                      MR 재생
                    </a>
                    <button
                      onClick={() => setLyricsTarget(song)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-colors bg-purple-50 text-purple-700 hover:bg-purple-100"
                    >
                      <FileText size={13} />
                      가사 보기
                    </button>
                  </div>

                  {/* 작성자 */}
                  <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-gray-100">
                    <Avatar name={song.users?.name ?? "?"} size="sm" />
                    <span className="text-xs font-medium text-gray-600">
                      {song.users?.name ?? "알 수 없음"}
                    </span>
                    {song.users?.part && (
                      <span className="text-xs text-gray-400">
                        {PART_ICON[song.users.part] ?? ""}
                      </span>
                    )}
                    <span className="ml-auto text-[10px] text-gray-400">
                      {formatDate(song.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 가사 모달 */}
      {lyricsTarget && (
        <LyricsModal
          open={true}
          onClose={() => setLyricsTarget(null)}
          title={lyricsTarget.title}
          artist={lyricsTarget.artist}
          lyrics={lyricsTarget.lyrics}
          youtubeUrl={lyricsTarget.youtube_url}
        />
      )}

      {/* 곡 추가 바텀시트 */}
      <AddSongSheet
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdded={fetchSongs}
      />
    </>
  );
}
