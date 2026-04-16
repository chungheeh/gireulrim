"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { Coins, Upload, Check, Users, Mic2 } from "lucide-react";

const BANK_INFO = {
  bank: "카카오뱅크",
  account: "3333-28-1234567",
  holder: "길울림밴드",
};

const PAYMENT_TYPES = [
  {
    id: "정모비" as const,
    label: "정모비",
    icon: <Users size={18} className="text-green-600" />,
    bg: "bg-green-50 border-green-400",
    amount: 9000,
    desc: "정기 모임 참가비",
  },
  {
    id: "버스킹/공연비" as const,
    label: "버스킹/공연비",
    icon: <Mic2 size={18} className="text-purple-600" />,
    bg: "bg-purple-50 border-purple-400",
    amount: null,
    desc: "버스킹·공연 참가비 (금액 직접 입력)",
  },
] as const;

type PaymentType = "정모비" | "버스킹/공연비";

export default function PaymentPage() {
  const router = useRouter();
  const supabase = createClient();

  const [paymentType, setPaymentType] = useState<PaymentType | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selected = PAYMENT_TYPES.find((t) => t.id === paymentType);
  const amount = paymentType === "정모비" ? 9000 : customAmount ? parseInt(customAmount.replace(/,/g, "")) : 0;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!paymentType) { setError("납부 종류를 선택해 주세요."); return; }
    if (paymentType === "버스킹/공연비" && !amount) { setError("금액을 입력해 주세요."); return; }
    if (!file) { setError("입금 확인증 사진을 첨부해 주세요."); return; }

    setSubmitting(true);
    setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다.");

      // 이미지 업로드
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("payment-proofs")
        .upload(path, file);
      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from("payment-proofs").getPublicUrl(path);

      // DB 저장
      const { error: dbErr } = await supabase.from("payment_proofs").insert({
        user_id: user.id,
        payment_type: paymentType,
        amount,
        memo: memo.trim() || null,
        image_url: urlData.publicUrl,
      });
      if (dbErr) throw dbErr;

      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "오류가 발생했어요. 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <>
        <PageHeader title="납부 완료" />
        <div className="px-4 py-16 flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check size={32} className="text-green-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">업로드 완료!</h2>
          <p className="text-sm text-gray-500">관리자 확인 후 승인됩니다.<br />보통 1~2일 내로 처리돼요.</p>
          <button
            onClick={() => router.replace("/mypage")}
            className="mt-4 rounded-2xl bg-green-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-green-700 transition-colors"
          >
            마이페이지로 돌아가기
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="비용 납부" />

      <div className="px-4 py-5 space-y-5">

        {/* 1단계: 납부 종류 선택 */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-700">납부 종류 선택</h2>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => { setPaymentType(type.id); setError(""); }}
                className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 text-center transition-all ${
                  paymentType === type.id
                    ? type.bg + " shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {paymentType === type.id && (
                  <div className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-600">
                    <Check size={11} className="text-white" />
                  </div>
                )}
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  type.id === "정모비" ? "bg-green-100" : "bg-purple-100"
                }`}>
                  {type.icon}
                </div>
                <span className="text-sm font-bold text-gray-800">{type.label}</span>
                <span className="text-[11px] text-gray-400 leading-snug">{type.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {paymentType && (
          <>
            {/* 계좌 안내 */}
            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Coins size={16} className="text-green-600" />
                <span className="text-sm font-semibold text-gray-800">입금 계좌 안내</span>
              </div>
              <div className="space-y-2 bg-gray-50 rounded-xl p-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">은행</span>
                  <span className="font-medium text-gray-800">{BANK_INFO.bank}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">계좌번호</span>
                  <span className="font-bold text-gray-900 tracking-wider">{BANK_INFO.account}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">예금주</span>
                  <span className="font-medium text-gray-800">{BANK_INFO.holder}</span>
                </div>
                <div className="flex justify-between text-xs border-t border-gray-200 pt-2 mt-1">
                  <span className="text-gray-400">납부 종류</span>
                  <span className={`font-bold ${paymentType === "정모비" ? "text-green-700" : "text-purple-700"}`}>
                    {paymentType}
                  </span>
                </div>
                {paymentType === "정모비" && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">금액</span>
                    <span className="font-bold text-green-700">9,000원</span>
                  </div>
                )}
              </div>
            </section>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 금액 (버스킹/공연비만) */}
              {paymentType === "버스킹/공연비" && (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    납부 금액 <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 pr-8 outline-none focus:border-purple-500 focus:bg-white focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">원</span>
                  </div>
                </div>
              )}

              {/* 메모 */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">메모 (선택)</label>
                <input
                  type="text"
                  placeholder="예: 5월 정모, 홍대 버스킹 등"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500 transition-all"
                />
              </div>

              {/* 입금 확인증 업로드 */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  입금 확인증 <span className="text-red-400">*</span>
                </label>
                <label
                  htmlFor="payment-file"
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-gray-50 cursor-pointer transition-colors overflow-hidden ${
                    file ? "border-green-300 p-0" : "border-gray-200 py-8 hover:border-green-300 hover:bg-green-50"
                  }`}
                >
                  {preview ? (
                    <div className="relative w-full">
                      <img src={preview} alt="입금 확인증" className="w-full max-h-56 object-cover" />
                      <div className="absolute bottom-2 right-2 rounded-lg bg-black/50 px-2.5 py-1 text-[11px] text-white">
                        사진 변경
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} className="text-gray-400" />
                      <span className="text-sm text-gray-500">이미지를 선택하세요</span>
                      <span className="text-xs text-gray-400">JPG, PNG, HEIC 가능</span>
                    </>
                  )}
                  <input
                    id="payment-file"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-600 font-medium">
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-green-600 py-4 text-sm font-bold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
              >
                {submitting ? "업로드 중..." : "입금 확인 요청"}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 pb-2">
              입금자명은 반드시 닉네임과 동일하게 입력해 주세요
            </p>
          </>
        )}
      </div>
    </>
  );
}
