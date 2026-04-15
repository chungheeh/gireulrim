"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Star, StarOff, Trash2, Music2 } from "lucide-react";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";

interface Song {
  id: string;
  title: string;
  artist: string;
  tag: string | null;
  song_key: string | null;
  is_busking_selected: boolean;
  user_id: string;
  created_at: string;
  users: { name: string; part: string | null } | null;
}

const TAG_BADGE: Record<string, "green" | "purple" | "yellow" | "gray"> = {
  솔로: "green",
  "듀엣 모집": "purple",
  단체곡: "yellow",
};

export default function AdminSongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const supabase = createClient();

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("songs")
      .select("*, users(name, part)")
      .order("created_at", { ascending: false });
    setSongs((data as Song[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchSongs(); }, [fetchSongs]);

  async function toggleBusking(song: Song) {
    setUpdating(song.id);
    await supabase.from("songs").update({ is_busking_selected: !song.is_busking_selected }).eq("id", song.id);
    setSongs(prev => prev.map(s => s.id === song.id ? { ...s, is_busking_selected: !s.is_busking_selected } : s));
    setUpdating(null);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" 곡을 삭제할까요?`)) return;
    await supabase.from("songs").delete().eq("id", id);
    setSongs(prev => prev.filter(s => s.id !== id));
  }

  const confirmed = songs.filter(s => s.is_busking_selected);
  const others    = songs.filter(s => !s.is_busking_selected);

  const SongCard = ({ song }: { song: Song }) => (
    <div className={`rounded-2xl border bg-white p-4 shadow-sm overflow-hidden ${song.is_busking_selected ? "border-yellow-300" : "border-gray-200"}`}>
      {song.is_busking_selected && (
        <div className="flex items-center gap-1 bg-yellow-500 -mx-4 -mt-4 px-4 py-1.5 mb-3">
          <Star size={11} className="text-yellow-900 fill-yellow-900" />
          <span className="text-[11px] font-bold text-yellow-900">버스킹 확정</span>
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            {song.tag && <Badge variant={TAG_BADGE[song.tag] ?? "gray"}>{song.tag}</Badge>}
            {song.song_key && <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-1">Key {song.song_key}</span>}
          </div>
          <p className="text-sm font-bold text-gray-900 line-clamp-1">{song.title}</p>
          <p className="text-xs text-gray-500">{song.artist}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Avatar name={song.users?.name ?? "?"} size="sm" />
            <span className="text-xs text-gray-500">{song.users?.name ?? "알 수 없음"}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <button
            onClick={() => toggleBusking(song)}
            disabled={updating === song.id}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-2 text-[11px] font-semibold transition-colors disabled:opacity-50 ${
              song.is_busking_selected
                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {song.is_busking_selected ? <StarOff size={12} /> : <Star size={12} />}
            {song.is_busking_selected ? "취소" : "확정"}
          </button>
          <button
            onClick={() => handleDelete(song.id, song.title)}
            className="flex items-center justify-center rounded-xl p-2 text-red-400 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">선곡 확정 관리</h2>
        <span className="text-xs text-gray-400">전체 {songs.length}곡 · 확정 {confirmed.length}곡</span>
      </div>

      {loading ? (
        <div className="flex justify-center pt-10"><div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" /></div>
      ) : (
        <>
          {confirmed.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <p className="text-sm font-bold text-gray-800">버스킹 셋리스트 ({confirmed.length}곡)</p>
              </div>
              {confirmed.map(song => <SongCard key={song.id} song={song} />)}
              <div className="border-t border-gray-200 pt-2" />
            </div>
          )}

          {others.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Music2 size={14} className="text-gray-500" />
                <p className="text-sm font-bold text-gray-800">전체 곡 목록 ({others.length}곡)</p>
              </div>
              {others.map(song => <SongCard key={song.id} song={song} />)}
            </div>
          )}

          {songs.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">등록된 곡이 없어요</div>
          )}
        </>
      )}
    </div>
  );
}
