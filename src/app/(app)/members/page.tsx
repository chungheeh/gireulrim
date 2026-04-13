import PageHeader from "@/components/PageHeader";
import { Users, Search, GraduationCap } from "lucide-react";

export default function MembersPage() {
  return (
    <>
      <PageHeader
        title="멤버"
        subtitle="길울림 소모임 구성원"
      />

      <div className="px-4 py-4 space-y-4">
        {/* 검색 */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-2.5">
          <Search size={16} className="text-slate-400 shrink-0" />
          <span className="text-sm text-slate-500">이름으로 검색</span>
        </div>

        {/* 포인트 레슨 안내 배너 */}
        <div className="flex items-start gap-3 rounded-xl bg-slate-800/60 border border-slate-700/50 px-4 py-3">
          <GraduationCap size={18} className="text-orange-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-orange-400">포인트 레슨</p>
            <p className="text-xs text-slate-400 mt-0.5">
              레슨 가능 멤버에게 1:1 보컬 포인트 레슨을 요청할 수 있어요.
            </p>
          </div>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center pt-12 text-center">
          <div className="mb-4 rounded-full bg-slate-800 p-5">
            <Users size={36} className="text-slate-500" />
          </div>
          <p className="text-base font-medium text-slate-300">아직 멤버가 없어요</p>
          <p className="mt-1 text-sm text-slate-500 leading-relaxed">
            함께할 멤버들이 가입하면<br />이곳에서 확인할 수 있어요 🙌
          </p>
        </div>
      </div>
    </>
  );
}
