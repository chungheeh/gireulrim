import PageHeader from "@/components/PageHeader";
import { CalendarDays, Music2, Bell } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <PageHeader
        title="길울림"
        subtitle="직장인 보컬 소모임"
        action={
          <button className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <Bell size={20} />
          </button>
        }
      />

      <div className="px-4 py-5 space-y-6">
        {/* 배너 */}
        <div className="rounded-2xl bg-gradient-to-br from-orange-500/20 via-slate-800 to-slate-900 border border-orange-500/20 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-2">
            길울림 소개
          </p>
          <p className="text-sm leading-relaxed text-slate-300">
            퇴근 후, 각자의 하루를 마치고{" "}
            <span className="text-white font-medium">길 위에서 음악으로 이어지는 순간</span>을
            함께합니다. 완벽한 실력보다 꾸준히 함께할 수 있는 분을 환영해요.
          </p>
        </div>

        {/* 다가오는 일정 */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays size={16} className="text-orange-400" />
            <h2 className="text-sm font-semibold text-white">다가오는 모임</h2>
          </div>

          {/* Empty state */}
          <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
            <CalendarDays size={32} className="mx-auto mb-3 text-slate-600" />
            <p className="text-sm text-slate-400">아직 등록된 일정이 없어요.</p>
            <p className="text-xs text-slate-500 mt-1">
              새 모임 일정을 기다려 보세요 🎵
            </p>
          </div>
        </section>

        {/* 최신 곡 */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Music2 size={16} className="text-orange-400" />
            <h2 className="text-sm font-semibold text-white">최근 올라온 곡</h2>
          </div>

          <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
            <Music2 size={32} className="mx-auto mb-3 text-slate-600" />
            <p className="text-sm text-slate-400">아직 등록된 곡이 없어요.</p>
            <p className="text-xs text-slate-500 mt-1">
              부르고 싶은 곡을 먼저 올려보세요 🎤
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
