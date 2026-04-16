import PageHeader from "@/components/PageHeader";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import LogoutButton from "@/components/LogoutButton";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/types";
import Link from "next/link";
import {
  Coins,
  Calendar,
  Music2,
  ChevronRight,
  GraduationCap,
  Settings,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

const PART_ICON: Record<string, string> = {
  보컬: "🎤",
  기타: "🎸",
  퍼커션: "🥁",
  키보드: "🎹",
};

// 이번 달 참석 도장 UI
function AttendanceStamps({ count, total = 4 }: { count: number; total?: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`flex h-10 w-10 items-center justify-center rounded-full text-lg border-2 transition-all ${
            i < count
              ? "border-green-400 bg-green-50 shadow-sm"
              : "border-gray-200 bg-gray-50 opacity-40"
          }`}
        >
          {i < count ? "🎤" : "○"}
        </div>
      ))}
      <span className="ml-1 text-xs text-gray-500">
        이번 달 <span className="font-bold text-green-600">{count}</span>/{total}회
      </span>
    </div>
  );
}

export default async function MyPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  let profile: Database["public"]["Tables"]["users"]["Row"] | null = null;
  if (user) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  // 이번 달 참석 횟수
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  let attendanceCount = 0;
  if (user) {
    const { count } = await supabase
      .from("attendances")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "attending")
      .gte("created_at", monthStart);
    attendanceCount = count ?? 0;
  }

  return (
    <>
      <PageHeader title="MY" />

      <div className="px-4 py-5 space-y-4">
        {/* 프로필 카드 */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-green-600 to-green-700 px-5 py-5">
            <div className="flex items-center gap-4">
              <Avatar name={profile?.name ?? user?.email ?? "?"} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg font-bold text-white">
                    {profile?.name ?? "프로필 미설정"}
                  </span>
                  {profile?.part && (
                    <span className="text-xl">{PART_ICON[profile.part] ?? "🎵"}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  {profile?.role === "admin" && <Badge variant="yellow">모임장</Badge>}
                  {profile?.part && <Badge variant="yellow">{profile.part}</Badge>}
                  {profile?.can_give_lesson && <Badge variant="yellow">레슨 가능</Badge>}
                </div>
                {profile?.signature_song && (
                  <p className="text-xs text-green-200 mt-1.5">
                    🎵 {profile.signature_song}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 이번 달 참석 도장 */}
          <div className="px-5 py-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              이번 달 참석
            </p>
            <AttendanceStamps count={attendanceCount} />
          </div>
        </div>

        {/* 크레딧 잔액 */}
        <div className="rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Coins size={16} className="text-yellow-900" />
              <span className="text-xs font-bold text-yellow-900 uppercase tracking-wide">크레딧 잔액</span>
            </div>
            <Link href="/mypage/credits" className="rounded-full bg-yellow-600/30 px-2.5 py-1 text-[11px] font-semibold text-yellow-900 hover:bg-yellow-600/40 transition-colors">
              내역 보기
            </Link>
          </div>
          <p className="text-4xl font-black text-yellow-900 mt-1">
            {(profile?.current_credits ?? 0).toLocaleString()}
            <span className="text-lg font-normal ml-1">원</span>
          </p>
          <p className="text-xs text-yellow-800/70 mt-1.5">정기 모임 참가비 9,000원 / 회</p>
        </div>

        {/* 회비 납부 현황 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">
                <Coins size={17} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">4월 회비 납부</p>
                <p className="text-xs text-gray-400">계좌이체 후 입금 캡처 업로드</p>
              </div>
            </div>
            <Link href="/mypage/payment" className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700 transition-colors">
              업로드
            </Link>
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <nav className="rounded-2xl bg-white border border-gray-200 divide-y divide-gray-100 shadow-sm">
          {[
            { Icon: Calendar,       label: "참석 현황",    desc: "모임 참석 이력 보기",     variant: "green",  href: "/mypage/attendance" },
            { Icon: Music2,         label: "내 곡 목록",   desc: "내가 등록한 곡 관리",     variant: "purple", href: "/songs" },
            { Icon: GraduationCap,  label: "레슨 요청 내역", desc: "포인트 레슨 요청/수락", variant: "purple", href: "/mypage/lessons" },
            { Icon: Settings,       label: "프로필 수정",  desc: "파트, 장르, 18번 곡 등",  variant: "gray",   href: "/mypage/edit" },
            { Icon: MessageSquare,  label: "건의사항",     desc: "운영진에게 의견 전달",    variant: "gray",   href: "/mypage/feedback" },
          ].map(({ Icon, label, desc, variant, href }) => (
            <Link
              key={label}
              href={href}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                variant === "green"  ? "bg-green-50"  :
                variant === "purple" ? "bg-purple-50" : "bg-gray-100"
              }`}>
                <Icon size={17} className={
                  variant === "green"  ? "text-green-600"  :
                  variant === "purple" ? "text-purple-600" : "text-gray-500"
                } />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </Link>
          ))}
        </nav>

        {/* 관리자 페이지 (admin 역할만 표시) */}
        {profile?.role === "admin" && (
          <Link
            href="/admin"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 py-3.5 text-sm font-semibold text-green-700 hover:bg-green-100 transition-colors"
          >
            <ShieldCheck size={15} />
            관리자 페이지
          </Link>
        )}

        {/* 로그아웃 */}
        <LogoutButton />

        <p className="text-center text-xs text-gray-300 pb-2">길울림 v0.1.0</p>
      </div>
    </>
  );
}
