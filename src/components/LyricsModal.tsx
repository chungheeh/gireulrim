"use client";

import { X, ExternalLink } from "lucide-react";

interface LyricsModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  artist: string;
  lyrics: string | null;
  youtubeUrl: string | null;
}

export default function LyricsModal({
  open,
  onClose,
  title,
  artist,
  lyrics,
  youtubeUrl,
}: LyricsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button
          onClick={onClose}
          className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="닫기"
        >
          <X size={20} className="text-gray-600" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 leading-tight truncate">{title}</p>
          <p className="text-xs text-gray-500 truncate">{artist}</p>
        </div>
        {youtubeUrl && (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors shrink-0"
          >
            <ExternalLink size={12} />
            유튜브에서 보기
          </a>
        )}
      </div>

      {/* 가사 영역 */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {lyrics ? (
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-800">{lyrics}</p>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <p className="text-gray-400 text-sm">가사가 등록되지 않았어요</p>
          </div>
        )}
      </div>
    </div>
  );
}
