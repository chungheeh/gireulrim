import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import { Calendar } from "lucide-react";

type AttendanceRecord = {
  date: string;
  attended: boolean;
};

type MonthData = {
  month: string;
  count: number;
  records: AttendanceRecord[];
};

const MOCK_DATA: MonthData[] = [
  {
    month: "2026년 4월",
    count: 2,
    records: [
      { date: "4월 6일 (일)", attended: true },
      { date: "4월 13일 (일)", attended: true },
    ],
  },
  {
    month: "2026년 3월",
    count: 4,
    records: [
      { date: "3월 2일 (일)", attended: true },
      { date: "3월 9일 (일)", attended: true },
      { date: "3월 16일 (일)", attended: true },
      { date: "3월 23일 (일)", attended: true },
    ],
  },
  {
    month: "2026년 2월",
    count: 3,
    records: [
      { date: "2월 2일 (일)", attended: true },
      { date: "2월 9일 (일)", attended: false },
      { date: "2월 16일 (일)", attended: true },
      { date: "2월 23일 (일)", attended: true },
    ],
  },
];

export default function AttendancePage() {
  return (
    <>
      <PageHeader title="참석 현황" />

      <div className="px-4 py-5 space-y-4">
        {/* 요약 카드 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">
              <Calendar size={17} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">이번 달 참석</p>
              <p className="text-xs text-gray-400">4월 기준</p>
            </div>
          </div>
          {/* 도장 UI */}
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg transition-all ${
                  i < 2
                    ? "border-green-400 bg-green-50 shadow-sm"
                    : "border-gray-200 bg-gray-50 opacity-40"
                }`}
              >
                {i < 2 ? "🎤" : "○"}
              </div>
            ))}
            <span className="ml-1 text-xs text-gray-500">
              이번 달 <span className="font-bold text-green-600">2</span>/4회
            </span>
          </div>
        </div>

        {/* 월별 내역 */}
        {MOCK_DATA.map((monthData) => (
          <div
            key={monthData.month}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-800">{monthData.month}</p>
              <span className="text-xs text-gray-400">
                <span className="font-bold text-green-600">{monthData.count}</span>회 참석
              </span>
            </div>
            <div className="space-y-2">
              {monthData.records.map((record) => (
                <div
                  key={record.date}
                  className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"
                >
                  <span className="text-sm text-gray-800">{record.date}</span>
                  <Badge variant={record.attended ? "green" : "gray"}>
                    {record.attended ? "참석" : "불참"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
