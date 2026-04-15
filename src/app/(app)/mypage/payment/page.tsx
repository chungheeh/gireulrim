"use client";

import { useState, useRef } from "react";
import PageHeader from "@/components/PageHeader";
import { Coins, Upload } from "lucide-react";

const BANK_INFO = {
  bank: "카카오뱅크",
  account: "3333-28-1234567",
  holder: "길울림밴드",
  amount: 9000,
};

export default function PaymentPage() {
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setSubmitted(true);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <>
      <PageHeader title="회비 납부" />

      <div className="px-4 py-5 space-y-4">
        {/* 계좌 안내 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 shrink-0">
              <Coins size={17} className="text-green-600" />
            </div>
            <p className="text-sm font-semibold text-gray-800">입금 계좌 안내</p>
          </div>
          <div className="space-y-2 bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">은행</span>
              <span className="text-sm font-medium text-gray-800">
                {BANK_INFO.bank}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">계좌번호</span>
              <span className="text-sm font-bold text-gray-900 tracking-wider">
                {BANK_INFO.account}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">예금주</span>
              <span className="text-sm font-medium text-gray-800">
                {BANK_INFO.holder}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-2 mt-1">
              <span className="text-xs text-gray-400">금액</span>
              <span className="text-sm font-bold text-green-700">
                {BANK_INFO.amount.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 성공 메시지 */}
        {submitted && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-center">
            <p className="text-sm font-medium text-green-700">
              입금 확인 요청이 전달되었습니다! 관리자 확인 후 승인됩니다.
            </p>
          </div>
        )}

        {/* 업로드 폼 */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <label
              htmlFor="payment-file"
              className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide"
            >
              입금 확인증 업로드
            </label>
            <label
              htmlFor="payment-file"
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-8 cursor-pointer hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <Upload size={24} className="text-gray-400" />
              {file ? (
                <span className="text-sm font-medium text-green-700">
                  {file.name}
                </span>
              ) : (
                <>
                  <span className="text-sm text-gray-500">
                    이미지를 선택하세요
                  </span>
                  <span className="text-xs text-gray-400">
                    JPG, PNG, HEIC 가능
                  </span>
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

          <button
            type="submit"
            disabled={!file}
            className="rounded-xl bg-green-600 py-3 text-sm font-bold text-white w-full hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            업로드
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          입금자명은 반드시 카카오톡 닉네임과 동일하게 입력해주세요
        </p>
      </div>
    </>
  );
}
