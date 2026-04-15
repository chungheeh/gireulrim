import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import { GraduationCap } from "lucide-react";

type LessonStatus = "요청중" | "수락됨" | "거절됨";

type LessonRequest = {
  id: number;
  targetName: string;
  part: string;
  date: string;
  status: LessonStatus;
};

const MOCK_LESSONS: LessonRequest[] = [
  {
    id: 1,
    targetName: "김지수",
    part: "보컬",
    date: "2026.04.10",
    status: "수락됨",
  },
  {
    id: 2,
    targetName: "박민준",
    part: "기타",
    date: "2026.04.07",
    status: "요청중",
  },
  {
    id: 3,
    targetName: "이하은",
    part: "보컬",
    date: "2026.03.22",
    status: "요청중",
  },
];

const STATUS_VARIANT: Record<LessonStatus, "green" | "yellow" | "gray"> = {
  수락됨: "green",
  요청중: "yellow",
  거절됨: "gray",
};

export default function LessonsPage() {
  return (
    <>
      <PageHeader title="레슨 요청 내역" />

      <div className="px-4 py-5 space-y-4">
        {/* 요약 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50">
              <GraduationCap size={17} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">레슨 요청 현황</p>
              <p className="text-xs text-gray-400">
                총 3건 · 요청중 2건 · 수락됨 1건
              </p>
            </div>
          </div>
        </div>

        {/* 요청 목록 */}
        <div className="space-y-3">
          {MOCK_LESSONS.map((lesson) => (
            <div
              key={lesson.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 shrink-0">
                    <GraduationCap size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-semibold text-gray-800">
                        {lesson.targetName}
                      </span>
                      <Badge variant="gray">{lesson.part}</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{lesson.date}</p>
                  </div>
                </div>
                <Badge variant={STATUS_VARIANT[lesson.status]}>
                  {lesson.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {MOCK_LESSONS.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
            <GraduationCap size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">레슨 요청 내역이 없습니다</p>
          </div>
        )}
      </div>
    </>
  );
}
