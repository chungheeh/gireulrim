import PageHeader from "@/components/PageHeader";
import { Coins, Calendar, Music2, ChevronRight, LogIn } from "lucide-react";

export default function MyPage() {
  return (
    <>
      <PageHeader title="MY" />

      <div className="px-4 py-5 space-y-5">
        {/* 프로필 카드 */}
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white border border-gray-200 text-2xl">
              🎤
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">로그인이 필요해요</p>
              <p className="text-xs text-gray-400 mt-0.5">길울림 멤버로 참여해 보세요</p>
            </div>
            <button className="flex items-center gap-1 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition-colors shrink-0">
              <LogIn size={13} />
              로그인
            </button>
          </div>
        </div>

        {/* 크레딧 잔액 */}
        <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Coins size={15} className="text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">크레딧 잔액</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            0<span className="text-base font-normal text-gray-400 ml-1">원</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">정기 모임 참가비: 9,000원 / 회</p>
        </div>

        {/* 메뉴 리스트 */}
        <nav className="rounded-2xl bg-gray-50 border border-gray-200 divide-y divide-gray-100">
          {[
            { Icon: Calendar, label: "참석 현황", desc: "모임 참석 이력" },
            { Icon: Music2,   label: "내 곡 목록", desc: "내가 등록한 곡" },
            { Icon: Coins,    label: "크레딧 내역", desc: "입금 · 차감 내역" },
          ].map(({ Icon, label, desc }) => (
            <button
              key={label}
              className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-gray-100 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-200">
                <Icon size={17} className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </button>
          ))}
        </nav>

        <p className="text-center text-xs text-gray-300 pb-2">길울림 v0.1.0</p>
      </div>
    </>
  );
}
