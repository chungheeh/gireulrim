import PageHeader from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import MembersClient from "./MembersClient";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default async function MembersPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: members } = await supabase
    .from("users")
    .select("id, name, instruments, preferred_genre, vocal_range, favorite_artist, signature_song, bio, can_give_lesson, age, location, available_days, role")
    .order("name");

  const memberList = members ?? [];

  return (
    <>
      <PageHeader
        title="멤버"
        subtitle={`길울림 ${memberList.length}명`}
        action={
          <Link
            href="/chat"
            className="flex items-center gap-1.5 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
          >
            <MessageCircle size={14} />
            단체채팅
          </Link>
        }
      />
      <MembersClient members={memberList} currentUserId={user?.id} />
    </>
  );
}
