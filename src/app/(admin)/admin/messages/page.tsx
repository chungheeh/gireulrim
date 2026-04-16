import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import { MessageCircle } from "lucide-react";

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  type DMRow = {
    sender: { id: string; name: string } | null;
    content: string;
    created_at: string;
    read_at: string | null;
  };

  // 내게 온 DM — 보낸 사람 기준으로 최신 메시지만
  const { data: dms } = await supabase
    .from("direct_messages")
    .select("content, created_at, read_at, sender:sender_id(id, name)")
    .eq("receiver_id", user.id)
    .order("created_at", { ascending: false });

  // sender별로 가장 최신 메시지만 남기기
  const seen = new Set<string>();
  const conversations: {
    senderId: string;
    senderName: string;
    lastMessage: string;
    lastTime: string;
    unread: boolean;
  }[] = [];

  for (const dm of (dms ?? []) as DMRow[]) {
    if (!dm.sender || seen.has(dm.sender.id)) continue;
    seen.add(dm.sender.id);
    conversations.push({
      senderId: dm.sender.id,
      senderName: dm.sender.name,
      lastMessage: dm.content,
      lastTime: dm.created_at,
      unread: !dm.read_at,
    });
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <h2 className="text-base font-bold text-gray-900">메시지 수신함</h2>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageCircle size={40} className="text-gray-200 mb-3" />
          <p className="text-sm text-gray-400">받은 메시지가 없어요</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white divide-y divide-gray-100 overflow-hidden shadow-sm">
          {conversations.map((conv) => (
            <Link
              key={conv.senderId}
              href={`/dm/${conv.senderId}`}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors"
            >
              <div className="relative shrink-0">
                <Avatar name={conv.senderName} size="md" />
                {conv.unread && (
                  <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold text-gray-900 ${conv.unread ? "font-bold" : ""}`}>
                    {conv.senderName}
                  </span>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                    {formatTime(conv.lastTime)}
                  </span>
                </div>
                <p className={`text-xs mt-0.5 line-clamp-1 ${conv.unread ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                  {conv.lastMessage}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
