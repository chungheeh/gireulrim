import PageHeader from "@/components/PageHeader";
import { Coins } from "lucide-react";

type TransactionType = "입금" | "출금";

type Transaction = {
  id: number;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    type: "출금",
    description: "정기 모임 참가비",
    amount: -9000,
    date: "2026.04.06",
  },
  {
    id: 2,
    type: "입금",
    description: "크레딧 충전",
    amount: 50000,
    date: "2026.03.15",
  },
  {
    id: 3,
    type: "출금",
    description: "정기 모임 참가비",
    amount: -9000,
    date: "2026.03.02",
  },
];

const CURRENT_BALANCE = 0;

export default function CreditsPage() {
  return (
    <>
      <PageHeader title="크레딧 내역" />

      <div className="px-4 py-5 space-y-4">
        {/* 현재 잔액 */}
        <div className="rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 p-5 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1">
            <Coins size={16} className="text-yellow-900" />
            <span className="text-xs font-bold text-yellow-900 uppercase tracking-wide">
              크레딧 잔액
            </span>
          </div>
          <p className="text-4xl font-black text-yellow-900 mt-1">
            {CURRENT_BALANCE.toLocaleString()}
            <span className="text-lg font-normal ml-1">원</span>
          </p>
          <p className="text-xs text-yellow-800/70 mt-1.5">
            정기 모임 참가비 9,000원 / 회
          </p>
        </div>

        {/* 거래 내역 */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              거래 내역
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            {MOCK_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3.5">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    tx.type === "입금" ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <Coins
                    size={16}
                    className={
                      tx.type === "입금" ? "text-green-600" : "text-red-500"
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 font-medium">
                    [{tx.type}] {tx.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{tx.date}</p>
                </div>
                <span
                  className={`text-sm font-bold shrink-0 ${
                    tx.amount > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount.toLocaleString()}원
                </span>
              </div>
            ))}
          </div>
        </div>

        {MOCK_TRANSACTIONS.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
            <Coins size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">거래 내역이 없습니다</p>
          </div>
        )}
      </div>
    </>
  );
}
