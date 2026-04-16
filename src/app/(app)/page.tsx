import PageHeader from "@/components/PageHeader";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import AttendanceButtons from "@/components/AttendanceButtons";
import { createClient } from "@/lib/supabase/server";
import { Bell, CalendarDays, Users, ChevronRight, Mic2, UserPlus } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // 다가오는 일정
  const today = new Date().toISOString().split("T")[0];
  const { data: schedules } = await supabase
    .from("schedules")
    .select("*")
    .gte("date", today)
    .order("date")
    .limit(1);
  const schedule = schedules?.[0] ?? null;

  // 참석 상태
  let attendanceStatus = "undecided";
  if (schedule && user) {
    const { data: attendance } = await supabase
      .from("attendances")
      .select("status")
      .eq("schedule_id", schedule.id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (attendance) attendanceStatus = attendance.status;
  }

  // 참석 인원
  let attendeeCount = 0;
  if (schedule) {
    const { count } = await supabase
      .from("attendances")
      .select("*", { count: "exact", head: true })
      .eq("schedule_id", schedule.id)
      .eq("status", "attending");
    attendeeCount = count ?? 0;
  }

  // 전체 멤버 수
  const { count: memberCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  // 최근 가입 멤버 (최신 3명)
  const { data: recentMembers } = await supabase
    .from("users")
    .select("id, name, instruments, preferred_genre, bio, signature_song, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr + "T00:00:00");
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];
    return `${month}월 ${day}일 (${weekday})`;
  }

  function formatJoinDate(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "오늘 가입";
    if (days < 7) return `${days}일 전 가입`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks}주 전 가입`;
    return new Date(dateStr).toLocaleDateString("ko-KR", { month: "short", day: "numeric" }) + " 가입";
  }

  function getInstrumentIcon(instruments: string[] | null): string {
    if (!instruments || instruments.length === 0) return "🎤";
    const first = instruments[0];
    if (first.includes("기타")) return "🎸";
    if (first.includes("키보드") || first.includes("피아노")) return "🎹";
    if (first.includes("드럼") || first.includes("퍼커션")) return "🥁";
    if (first.includes("베이스")) return "🎵";
    return "🎤";
  }

  return (
    <>
      <PageHeader
        title="길울림"
        subtitle="2030 보컬동아리"
        action={
          <button className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition-colors">
            <Bell size={20} />
          </button>
        }
      />

      <div className="space-y-0">
        {/* 그룹 배너 — 태그라인 + 실제 멤버 수만 표시 */}
        <div className="relative bg-gradient-to-br from-green-700 via-green-600 to-green-800 px-5 pt-6 pb-7">
          <p className="text-base text-green-100 leading-relaxed font-medium">
            퇴근 후, 길 위에서 음악으로<br />이어지는 순간을 함께합니다.
          </p>
          <div className="flex items-center gap-1.5 mt-4">
            <Users size={14} className="text-green-300" />
            <span className="text-sm font-bold text-white">멤버 {memberCount ?? 0}명</span>
          </div>
        </div>

        <div className="px-4 py-5 space-y-5">
          {/* 다가오는 모임 */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <CalendarDays size={15} className="text-green-600" />
                <h2 className="text-sm font-bold text-gray-800">다가오는 모임</h2>
              </div>
            </div>

            {schedule ? (
              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="bg-green-600 px-4 py-2.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{schedule.title}</span>
                  <Badge variant="yellow">
                    참가비 {(schedule.participation_fee as number).toLocaleString()}원
                  </Badge>
                </div>
                <div className="px-4 py-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CalendarDays size={13} className="text-gray-400 shrink-0" />
                    {formatDate(schedule.date as string)}
                    {(schedule.time as string | null) && (
                      <span className="text-gray-400">{schedule.time as string}</span>
                    )}
                  </div>
                  {(schedule.location as string | null) && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="text-gray-400">📍</span>
                      {schedule.location as string}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Users size={13} className="text-gray-400 shrink-0" />
                    참석 예정 {attendeeCount}명
                  </div>
                </div>
                {user ? (
                  <AttendanceButtons
                    scheduleId={schedule.id as string}
                    userId={user.id}
                    initialStatus={attendanceStatus}
                  />
                ) : (
                  <div className="flex border-t border-gray-100">
                    <p className="flex-1 py-3 text-center text-xs text-gray-400">
                      로그인 후 참석 여부를 알려주세요
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white px-4 py-6 text-center shadow-sm">
                <p className="text-sm text-gray-400">다가오는 일정이 없어요</p>
              </div>
            )}
          </section>

          {/* 최근 소식 — 최근 가입 멤버 */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Mic2 size={15} className="text-green-600" />
                <h2 className="text-sm font-bold text-gray-800">최근 소식</h2>
              </div>
            </div>

            <div className="space-y-2">
              {recentMembers && recentMembers.length > 0 ? (
                recentMembers.map((member) => (
                  <div
                    key={member.id}
                    className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar name={member.name} size="sm" />
                        <span className="text-xs font-medium text-gray-700">{member.name}</span>
                        <Badge variant="green">가입인사</Badge>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {formatJoinDate(member.created_at as string)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{getInstrumentIcon(member.instruments as string[] | null)}</span>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {member.bio
                          ? member.bio
                          : member.signature_song
                          ? `18번 곡: ${member.signature_song}`
                          : (member.preferred_genre as string[] | null)?.slice(0, 2).join(", ") ?? "안녕하세요!"}
                      </p>
                    </div>
                    {member.preferred_genre && (member.preferred_genre as string[]).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {(member.preferred_genre as string[]).slice(0, 3).map((g) => (
                          <Badge key={g} variant="yellow">{g}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-6 text-center">
                  <UserPlus size={24} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">아직 가입한 멤버가 없어요</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
