"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { MessageSquare } from "lucide-react";

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
    setMessage("");
  }

  return (
    <>
      <PageHeader title="건의사항" />

      <div className="px-4 py-5 space-y-4">
        {/* 안내 카드 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 shrink-0">
              <MessageSquare size={17} className="text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">운영진에게 의견 전달</p>
              <p className="text-xs text-gray-400">불편한 점, 개선 아이디어, 칭찬 모두 환영해요</p>
            </div>
          </div>
        </div>

        {/* 성공 메시지 */}
        {submitted && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-center">
            <p className="text-sm font-medium text-green-700">
              건의사항이 전달되었습니다 😊
            </p>
          </div>
        )}

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <label
              htmlFor="feedback-message"
              className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide"
            >
              메시지
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="자유롭게 의견을 남겨주세요..."
              rows={6}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-green-400 focus:bg-white focus:outline-none transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1.5 text-right">
              {message.length} / 500자
            </p>
          </div>

          <button
            type="submit"
            disabled={!message.trim()}
            className="rounded-xl bg-green-600 py-3 text-sm font-bold text-white w-full hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            전송
          </button>
        </form>
      </div>
    </>
  );
}
