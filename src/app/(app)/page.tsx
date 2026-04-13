import PageHeader from "@/components/PageHeader";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import { Bell, CalendarDays, MapPin, Users, ChevronRight, Mic2 } from "lucide-react";

// 목업 데이터 (Supabase 연동 전 UI 확인용)
const upcomingSchedule = {
  title: "4월 정기 합주",
  date: "4월 19일 (토) 오후 7시",
  location: "홍대 연습실",
  attendees: 8,
  fee: 9000,
};

const recentPosts = [
  {
    id: 1,
    author: "한충희",
    tag: "공지",
    tagVariant: "red" as const,
    title: "4월 정기 합주 안내 및 셋리스트 제출 마감",
    preview: "📌 정모 정보\n📅 4월 19일(토) 오후 7시\n📍 홍대 연습실",
    time: "오늘 오전 10:22",
    isPinned: true,
  },
  {
    id: 2,
    author: "솔아",
    tag: "가입인사",
    tagVariant: "green" as const,
    title: "안녕하세요! 97년생 여자 보컬입니다",
    preview: "잔잔한 어쿠스틱 발라드 좋아하고 같이 듀엣 부르실 분 찾아요 🎤",
    time: "3월 28일 오전 8:28",
    isPinned: false,
  },
  {
    id: 3,
    author: "버드나무",
    tag: "모임후기",
    tagVariant: "purple" as const,
    title: "지난 주 합주 너무 재밌었어요!",
    preview: "처음 참석했는데 분위기가 너무 따뜻하고 좋았습니다. 다음 주도 참석할게요!",
    time: "4월 8일 오전 8:27",
    isPinned: false,
  },
];

export default function HomePage() {
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
        {/* 그룹 배너 */}
        <div className="relative bg-gradient-to-br from-green-700 via-green-600 to-green-800 px-5 pt-5 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl">
              🎤
            </div>
            <div>
              <p className="font-bold text-white text-base leading-tight">길울림밴드</p>
              <p className="text-green-200 text-xs mt-0.5">STREET RESONANCE</p>
            </div>
          </div>
          <p className="text-sm text-green-100 leading-relaxed">
            퇴근 후, 길 위에서 음악으로 이어지는 순간을 함께합니다.
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="yellow">대중가요</Badge>
            <Badge variant="yellow">인디</Badge>
            <Badge variant="yellow">어쿠스틱</Badge>
          </div>
          {/* 멤버수 */}
          <div className="flex items-center gap-1 mt-3">
            <Users size={13} className="text-green-300" />
            <span className="text-xs text-green-200">멤버 12명</span>
          </div>
        </div>

        <div className="px-4 py-5 space-y-5">
          {/* 다가오는 일정 카드 */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <CalendarDays size={15} className="text-green-600" />
                <h2 className="text-sm font-bold text-gray-800">다가오는 모임</h2>
              </div>
              <button className="flex items-center gap-0.5 text-xs text-gray-400">
                전체보기 <ChevronRight size={13} />
              </button>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              <div className="bg-green-600 px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{upcomingSchedule.title}</span>
                <Badge variant="yellow">참가비 {upcomingSchedule.fee.toLocaleString()}원</Badge>
              </div>
              <div className="px-4 py-3 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CalendarDays size={13} className="text-gray-400 shrink-0" />
                  {upcomingSchedule.date}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MapPin size={13} className="text-gray-400 shrink-0" />
                  {upcomingSchedule.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users size={13} className="text-gray-400 shrink-0" />
                  참석 예정 {upcomingSchedule.attendees}명
                </div>
              </div>
              <div className="flex border-t border-gray-100">
                <button className="flex-1 py-3 text-sm font-semibold text-green-600 hover:bg-green-50 transition-colors">
                  참석
                </button>
                <div className="w-px bg-gray-100" />
                <button className="flex-1 py-3 text-sm font-semibold text-gray-400 hover:bg-gray-50 transition-colors">
                  불참
                </button>
              </div>
            </div>
          </section>

          {/* 최근 소식 */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Mic2 size={15} className="text-green-600" />
                <h2 className="text-sm font-bold text-gray-800">최근 소식</h2>
              </div>
              <button className="flex items-center gap-0.5 text-xs text-gray-400">
                게시판 <ChevronRight size={13} />
              </button>
            </div>

            <div className="space-y-2">
              {recentPosts.map((post) => (
                <button
                  key={post.id}
                  className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Avatar name={post.author} size="sm" />
                      <span className="text-xs font-medium text-gray-700">{post.author}</span>
                      <Badge variant={post.tagVariant}>{post.tag}</Badge>
                      {post.isPinned && <span className="text-[10px] text-red-500 font-bold">[필독]</span>}
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">{post.time}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">{post.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed whitespace-pre-line">{post.preview}</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
