"use client";

import { X } from "lucide-react";
import Avatar from "@/components/Avatar";

export interface Attendee {
  user_id: string;
  users: {
    name: string;
    instruments: string[] | null;
    profile_image_url: string | null;
  } | null;
}

interface AttendeePopupProps {
  attendees: Attendee[];
  count: number;
}

function getMainLabel(instruments: string[] | null): string {
  if (!instruments || instruments.length === 0 || instruments[0].includes("없음")) return "보컬";
  const first = instruments[0];
  if (first.includes("키보드") || first.includes("피아노")) return "키보드";
  if (first.includes("드럼") || first.includes("퍼커션")) return "퍼커션";
  if (first.includes("기타")) return "기타";
  if (first.includes("베이스")) return "베이스";
  if (first.includes("우쿨렐레")) return "우쿨렐레";
  if (first.includes("바이올린")) return "바이올린";
  return "보컬";
}

export default function AttendeePopup({ attendees, count }: AttendeePopupProps) {
  return (
    <span
      className="text-green-600 font-semibold cursor-pointer hover:underline"
      onClick={(e) => {
        e.stopPropagation();
        const el = document.getElementById("attendee-popup");
        if (el) el.style.display = "flex";
      }}
    >
      {count}명
      {/* 팝업 */}
      <span
        id="attendee-popup"
        className="fixed inset-0 z-50 items-center justify-center bg-black/40 px-4"
        style={{ display: "none" }}
        onClick={(e) => {
          e.stopPropagation();
          (e.currentTarget as HTMLElement).style.display = "none";
        }}
      >
        <span
          className="w-full max-w-sm rounded-3xl bg-white flex flex-col max-h-[75vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <span className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0">
            <span className="text-sm font-bold text-gray-800">참석 예정 {count}명</span>
            <button
              onClick={() => {
                const el = document.getElementById("attendee-popup");
                if (el) el.style.display = "none";
              }}
              className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
            >
              <X size={17} className="text-gray-500" />
            </button>
          </span>

          {/* 목록 */}
          <span className="flex-1 overflow-y-auto divide-y divide-gray-100 px-2 pb-4">
            {attendees.length === 0 ? (
              <span className="block py-8 text-center text-sm text-gray-400">아직 참석 확정 인원이 없어요</span>
            ) : (
              attendees.map((a) => (
                <span key={a.user_id} className="flex items-center gap-3 px-3 py-3">
                  <Avatar
                    name={a.users?.name ?? "?"}
                    src={a.users?.profile_image_url ?? undefined}
                    size="md"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-gray-900">{a.users?.name ?? "알 수 없음"}</span>
                    <span className="block text-xs text-gray-400 mt-0.5">{getMainLabel(a.users?.instruments ?? null)}</span>
                  </span>
                </span>
              ))
            )}
          </span>
        </span>
      </span>
    </span>
  );
}
