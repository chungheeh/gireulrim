"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Avatar from "@/components/Avatar";
import { Send, ArrowLeft, Users } from "lucide-react";

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  users: { name: string } | null;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const hours = date.getHours();
  const mins = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours < 12 ? "오전" : "오후";
  const h = hours % 12 || 12;
  return `${ampm} ${h}:${mins}`;
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

export default function ChatPage() {
  const router = useRouter();
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      const { count } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });
      setMemberCount(count ?? 0);

      const { data } = await supabase
        .from("messages")
        .select("*, users(name)")
        .order("created_at", { ascending: true })
        .limit(100);
      if (data) {
        setMessages(data as Message[]);
        setTimeout(() => scrollToBottom(false), 50);
      }
    };
    init();

    const channel = supabase
      .channel("group-chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const { data } = await supabase
            .from("messages")
            .select("*, users(name)")
            .eq("id", payload.new.id)
            .single();
          if (data) {
            setMessages((prev) => [...prev, data as Message]);
            setTimeout(() => scrollToBottom(true), 50);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, scrollToBottom]);

  async function handleSend() {
    if (!input.trim() || !currentUserId || sending) return;
    setSending(true);
    const content = input.trim();
    setInput("");
    await supabase.from("messages").insert({ user_id: currentUserId, content });
    setSending(false);
    inputRef.current?.focus();
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-gray-50">
      {/* 헤더 */}
      <div className="shrink-0 flex items-center gap-3 bg-white border-b border-gray-200 px-4 py-3"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}>
        <button onClick={() => router.back()}
          className="rounded-full p-1.5 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-lg">
          🎤
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">길울림 단체채팅</p>
          <div className="flex items-center gap-1">
            <Users size={11} className="text-green-600" />
            <span className="text-[11px] text-gray-500">멤버 {memberCount}명</span>
          </div>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="text-5xl mb-3">💬</div>
            <p className="text-sm font-medium text-gray-600">길울림 단체채팅방</p>
            <p className="text-xs text-gray-400 mt-1">첫 번째 메시지를 보내보세요!</p>
          </div>
        )}

        <div className="space-y-1">
          {messages.map((msg, idx) => {
            const isMe = msg.user_id === currentUserId;
            const prevMsg = messages[idx - 1];
            const showDate = !prevMsg ||
              new Date(msg.created_at).toDateString() !== new Date(prevMsg.created_at).toDateString();
            const showAvatar = !isMe && (
              !prevMsg ||
              prevMsg.user_id !== msg.user_id ||
              new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime() > 120000
            );
            const showName = showAvatar;

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
                  {/* 아바타 */}
                  {!isMe && (
                    <div className="shrink-0 self-end mb-1">
                      {showAvatar
                        ? <Avatar name={msg.users?.name ?? "?"} size="sm" />
                        : <div className="w-7" />
                      }
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[72%] ${isMe ? "items-end" : "items-start"}`}>
                    {showName && (
                      <span className="text-[11px] text-gray-500 font-medium mb-1 ml-1">
                        {msg.users?.name ?? "알 수 없음"}
                      </span>
                    )}
                    <div className={`flex items-end gap-1.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
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
              </div>
            );
          })}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-3"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="메시지를 입력하세요..."
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
