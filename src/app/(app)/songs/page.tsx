"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import { Plus, Search, Play, FileText, Music2, Star } from "lucide-react";

// 파트별 아이콘
const PART_ICON: Record<string, string> = {
  보컬: "🎤",
  기타: "🎸",
  퍼커션: "🥁",
  키보드: "🎹",
};

// 목업 데이터
const MOCK_SONGS = [
  {
    id: "1",
    title: "나의 사람아",
    artist: "이선희",
    tag: "단체곡" as const,
    song_key: "A",
    youtube_url: "https://youtu.be/xxxxxx",
    youtube_thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    has_mr: true,
    has_lyrics: true,
    is_busking_selected: true,
    author: "한충희",
    author_part: "기타",
    created_at: "2일 전",
  },
  {
    id: "2",
    title: "사랑했지만",
    artist: "김광석",
    tag: "듀엣 모집" as const,
    song_key: "G",
    youtube_url: "https://youtu.be/xxxxxx",
    youtube_thumbnail: null,
    has_mr: true,
    has_lyrics: false,
    is_busking_selected: false,
    author: "솔아",
    author_part: "보컬",
    created_at: "4일 전",
  },
  {
    id: "3",
    title: "야생화",
    artist: "박효신",
    tag: "솔로" as const,
    song_key: "Bb",
    youtube_url: null,
    youtube_thumbnail: null,
    has_mr: false,
    has_lyrics: true,
    is_busking_selected: false,
    author: "버드나무",
    author_part: "보컬",
    created_at: "1주 전",
  },
  {
    id: "4",
    title: "오래된 노래",
    artist: "잔나비",
    tag: "단체곡" as const,
    song_key: "E",
    youtube_url: "https://youtu.be/xxxxxx",
    youtube_thumbnail: null,
    has_mr: true,
    has_lyrics: true,
    is_busking_selected: false,
    author: "민준",
    author_part: "키보드",
    created_at: "1주 전",
  },
];

type Filter = "전체" | "솔로" | "듀엣 모집" | "단체곡" | "버스킹 확정";

const TAG_BADGE: Record<string, "green" | "purple" | "yellow" | "gray"> = {
  솔로: "green",
  "듀엣 모집": "purple",
  단체곡: "yellow",
};

// YouTube 썸네일 컴포넌트
function YoutubeThumbnail({ url, title }: { url: string | null; title: string }) {
  if (url) {
    return (
      <div className="relative h-[68px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-gray-200">
        <img
          src={url}
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

export default function SongsPage() {
  const [filter, setFilter] = useState<Filter>("전체");
  const [search, setSearch] = useState("");

  const filters: Filter[] = ["전체", "솔로", "듀엣 모집", "단체곡", "버스킹 확정"];

  const filtered = MOCK_SONGS.filter((s) => {
    const matchTag =
      filter === "전체"
        ? true
        : filter === "버스킹 확정"
        ? s.is_busking_selected
        : s.tag === filter;
    const matchSearch =
      search === "" ||
      s.title.includes(search) ||
      s.artist.includes(search);
    return matchTag && matchSearch;
  });

  return (
    <>
      <PageHeader
        title="선곡 / 연습"
        subtitle="MR · 가사 · 유튜브 링크"
        action={
          <button className="flex items-center gap-1 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition-colors">
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

        {/* 곡 목록 */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-16 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-5">
              <Music2 size={36} className="text-gray-300" />
            </div>
            <p className="text-base font-medium text-gray-700">해당하는 곡이 없어요</p>
            <p className="mt-1 text-sm text-gray-400">곡을 추가하거나 필터를 변경해 보세요 🎵</p>
          </div>
        ) : (
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
                    <span className="text-[11px] font-bold text-yellow-900">버스킹 확정 셋리스트</span>
                  </div>
                )}

                <div className="p-3.5">
                  <div className="flex gap-3">
                    {/* 썸네일 */}
                    <YoutubeThumbnail url={song.youtube_thumbnail} title={song.title} />

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
                    <button
                      disabled={!song.has_mr}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-colors ${
                        song.has_mr
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-gray-50 text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <Play size={13} />
                      MR 재생
                    </button>
                    <button
                      disabled={!song.has_lyrics}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-colors ${
                        song.has_lyrics
                          ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
                          : "bg-gray-50 text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <FileText size={13} />
                      가사 보기
                    </button>
                  </div>

                  {/* 작성자 */}
                  <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-gray-100">
                    <Avatar name={song.author} size="sm" />
                    <span className="text-xs font-medium text-gray-600">{song.author}</span>
                    <span className="text-xs text-gray-400">{PART_ICON[song.author_part]}</span>
                    <span className="ml-auto text-[10px] text-gray-400">{song.created_at}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
