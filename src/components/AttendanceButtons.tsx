"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AttendanceStatus = "attending" | "absent" | "undecided";

interface AttendanceButtonsProps {
  scheduleId: string;
  userId: string;
  initialStatus: AttendanceStatus | string;
}

export default function AttendanceButtons({
  scheduleId,
  userId,
  initialStatus,
}: AttendanceButtonsProps) {
  const [status, setStatus] = useState<AttendanceStatus>(
    (initialStatus as AttendanceStatus) || "undecided"
  );
  const [loading, setLoading] = useState(false);
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [practiceNote, setPracticeNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const supabase = createClient();

  async function handleAttending() {
    if (loading) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("attendances").upsert(
        {
          schedule_id: scheduleId,
          user_id: userId,
          status: "attending" as const,
          practice_note: "",
        },
        { onConflict: "schedule_id,user_id" }
      );
      if (!error) {
        setStatus("attending");
        setShowNotePopup(true);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAbsent() {
    if (loading) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("attendances").upsert(
        {
          schedule_id: scheduleId,
          user_id: userId,
          status: "absent" as const,
          practice_note: "",
        },
        { onConflict: "schedule_id,user_id" }
      );
      if (!error) {
        setStatus("absent");
        setShowNotePopup(false);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveNote() {
    setSavingNote(true);
    try {
      await supabase.from("attendances").upsert(
        {
          schedule_id: scheduleId,
          user_id: userId,
          status: "attending" as const,
          practice_note: practiceNote,
        },
        { onConflict: "schedule_id,user_id" }
      );
      setShowNotePopup(false);
    } finally {
      setSavingNote(false);
    }
  }

  return (
    <>
      <div className="flex border-t border-gray-100">
        <button
          onClick={handleAttending}
          disabled={loading}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            status === "attending"
              ? "bg-green-50 text-green-700 font-bold"
              : "text-green-600 hover:bg-green-50"
          } disabled:opacity-50`}
        >
          {status === "attending" ? "참석 확정 ✓" : "참석"}
        </button>
        <div className="w-px bg-gray-100" />
        <button
          onClick={handleAbsent}
          disabled={loading}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            status === "absent"
              ? "bg-gray-100 text-gray-600 font-bold"
              : "text-gray-400 hover:bg-gray-50"
          } disabled:opacity-50`}
        >
          {status === "absent" ? "불참 확정 ✓" : "불참"}
        </button>
      </div>

      {/* 연습할 곡 팝업 */}
      {showNotePopup && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl">
            <h3 className="mb-1 text-sm font-bold text-gray-900">연습할 곡</h3>
            <p className="mb-3 text-xs text-gray-500">
              이번 모임에서 연습하고 싶은 곡을 적어주세요 (선택)
            </p>
            <textarea
              value={practiceNote}
              onChange={(e) => setPracticeNote(e.target.value)}
              placeholder="예: 아이유 - 밤편지, 볼빨간사춘기 - 우주를 줄게"
              rows={3}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-800 placeholder-gray-400 focus:border-green-500 focus:outline-none resize-none"
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setShowNotePopup(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-500 hover:bg-gray-50"
              >
                나중에
              </button>
              <button
                onClick={handleSaveNote}
                disabled={savingNote}
                className="flex-1 rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {savingNote ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
