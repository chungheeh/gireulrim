import PageHeader from "@/components/PageHeader";
import { Music2, Plus, Search } from "lucide-react";

export default function SongsPage() {
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

      <div className="px-4 py-4 space-y-4">
        {/* 검색 */}
        <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5">
          <Search size={16} className="text-gray-400 shrink-0" />
          <span className="text-sm text-gray-400">곡명 또는 아티스트 검색</span>
        </div>

        {/* 필터 태그 */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["전체", "솔로", "듀엣 모집", "단체곡", "버스킹 확정"].map((tag, i) => (
            <button
              key={tag}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                i === 0
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-500"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center pt-16 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-5">
            <Music2 size={36} className="text-gray-300" />
          </div>
          <p className="text-base font-medium text-gray-700">등록된 곡이 없어요</p>
          <p className="mt-1 text-sm text-gray-400 leading-relaxed">
            우리 모임에서 부르고 싶은 곡을<br />먼저 추가해 보세요 🎵
          </p>
        </div>
      </div>
    </>
  );
}
