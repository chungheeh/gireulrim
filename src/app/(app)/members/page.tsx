import PageHeader from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import MembersClient from "./MembersClient";
import { Users } from "lucide-react";

export default async function MembersPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: members } = await supabase
    .from("users")
    .select("id, name, instruments, preferred_genre, vocal_range, signature_song, bio, can_give_lesson, age, location, available_days")
    .order("name");

  const memberList = members ?? [];

  return (
    <>
      <PageHeader
        title="멤버"
        subtitle={`길울림 ${memberList.length}명`}
        action={
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Users size={14} />
            <span>{memberList.length}명</span>
          </div>
        }
      />
      <MembersClient members={memberList} currentUserId={user?.id} />
    </>
  );
}
