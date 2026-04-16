"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Avatar from "@/components/Avatar";
import { Send, ArrowLeft, Crown } from "lucide-react";

interface DM {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const hours = date.getHours();
  const mins = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours < 12 ? "오전" : "오후";
  return `${ampm} ${hours % 12 || 12}:${mins}`;
}

function formatDateDivider(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "오늘";
  if (date.toDateString() === yesterday.toDateString()) return "어제";
  return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

export default function DMPage() {
  const router = useRouter();
  const params = useParams();
  const otherId = params.userId as string;

  const supabase = createClient();
  const [messages, setMessages] = useState<DM[]>([]);
  const [input, setInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [otherName, setOtherName] = useState("");
  const [otherRole, setOtherRole] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      // 상대방 정보
      const { data: other } = await supabase
        .from("users")
        .select("name, role")
        .eq("id", otherId)
        .single();
      if (other) {
        setOtherName(other.name);
        setOtherRole(other.role ?? "");
      }

      // 기존 메시지 로드
      const { data } = await supabase
        .from("direct_messages")
        .select("*")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true })
        .limit(100);
      if (data) {
        setMessages(data as DM[]);
        setTimeout(() => scrollToBottom(false), 50);
      }

      // 읽음 처리
      await supabase
        .from("direct_messages")
        .update({ read_at: new Date().toISOString() })
        .eq("sender_id", otherId)
        .eq("receiver_id", user.id)
        .is("read_at", null);
    };
    init();

    const channel = supabase
      .channel(`dm-${otherId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "direct_messages" },
        (payload) => {
          const msg = payload.new as DM;
          const isRelevant =
            (msg.sender_id === currentUserId && msg.receiver_id === otherId) ||
            (msg.sender_id === otherId && msg.receiver_id === currentUserId);
          if (!isRelevant) return;
          setMessages((prev) => {
            const withoutTemp = prev.filter(
              (m) => !(m.id.startsWith("temp-") && m.sender_id === msg.sender_id && m.content === msg.content)
            );
            if (withoutTemp.some((m) => m.id === msg.id)) return withoutTemp;
            return [...withoutTemp, msg];
          });
          setTimeout(() => scrollToBottom(true), 50);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherId]);

  async function handleSend() {
    if (!input.trim() || !currentUserId || sending) return;
    setSending(true);
    const content = input.trim();
    setInput("");

    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: tempId, sender_id: currentUserId, receiver_id: otherId, content, created_at: new Date().toISOString() },
    ]);
    setTimeout(() => scrollToBottom(true), 50);

    await supabase.from("direct_messages").insert({
      sender_id: currentUserId,
      receiver_id: otherId,
      content,
    });
    setSending(false);
    inputRef.current?.focus();
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-gray-50">
      {/* 헤더 */}
      <div
        className="shrink-0 flex items-center gap-3 bg-white border-b border-gray-200 px-4 py-3"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
      >
        <button onClick={() => router.back()} className="rounded-full p-1.5 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <Avatar name={otherName || "?"} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-bold text-gray-900">{otherName || "..."}</p>
            {otherRole === "admin" && (
              <span className="flex items-center gap-0.5 rounded-full bg-yellow-100 px-1.5 py-0.5 text-[10px] font-bold text-yellow-700">
                <Crown size={9} />
                모임장
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400">1:1 메시지</p>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="text-5xl mb-3">💌</div>
            <p className="text-sm font-medium text-gray-600">{otherName}에게 메시지 보내기</p>
            <p className="text-xs text-gray-400 mt-1">첫 번째 메시지를 보내보세요!</p>
          </div>
        )}

        <div className="space-y-1">
          {messages.map((msg, idx) => {
            const isMe = msg.sender_id === currentUserId;
            const prev = messages[idx - 1];
            const showDate = !prev ||
              new Date(msg.created_at).toDateString() !== new Date(prev.created_at).toDateString();

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-[11px] text-gray-400 font-medium px-2">
                      {formatDateDivider(msg.created_at)}
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                )}
                <div className={`flex items-end gap-2 mt-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  {!isMe && <Avatar name={otherName || "?"} size="sm" />}
                  <div className={`flex items-end gap-1.5 max-w-[72%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words ${
                      isMe
                        ? "bg-green-600 text-white rounded-tr-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0 mb-0.5">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div
        className="shrink-0 border-t border-gray-200 bg-white px-4 py-3"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={`${otherName}에게 메시지...`}
            maxLength={500}
            className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-green-400 focus:bg-white transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-40"
          >
            <Send size={16} className="text-white ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
