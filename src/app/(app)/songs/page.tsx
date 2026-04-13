import PageHeader from "@/components/PageHeader";
import { Music2, Plus, Search } from "lucide-react";

export default function SongsPage() {
  return (
    <>
      <PageHeader
        title="곡 목록"
        subtitle="MR · 가사 · 유튜브 링크"
        action={
          <button className="flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 transition-colors">
            <Plus size={14} />
            곡 추가
          </button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* 검색 */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-2.5">
          <Search size={16} className="text-slate-400 shrink-0" />
          <span className="text-sm text-slate-500">곡명 또는 아티스트 검색</span>
        </div>

        {/* 필터 태그 */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {["전체", "대중가요", "인디", "어쿠스틱", "팝", "버스킹 선정"].map((tag) => (
            <button
              key={tag}
              className="shrink-0 rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-400 first:border-orange-500 first:bg-orange-500/10 first:text-orange-400 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center pt-16 text-center">
          <div className="mb-4 rounded-full bg-slate-800 p-5">
            <Music2 size={36} className="text-slate-500" />
          </div>
          <p className="text-base font-medium text-slate-300">등록된 곡이 없어요</p>
          <p className="mt-1 text-sm text-slate-500 leading-relaxed">
            우리 모임에서 부르고 싶은 곡을<br />먼저 추가해 보세요 🎵
          </p>
        </div>
      </div>
    </>
  );
}
