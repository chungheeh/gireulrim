// Auto-generate with: npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
// Placeholder types until generation is run

export type UserRole = "admin" | "member";
export type AttendanceStatus = "attending" | "absent" | "undecided";
export type CreditTransactionType = "deposit" | "withdraw";
export type RefundStatus = "pending" | "approved" | "rejected";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          role: UserRole;
          preferred_genre: string[] | null;
          vocal_range: string | null;
          current_credits: number;
          can_give_lesson: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      songs: {
        Row: {
          id: string;
          title: string;
          artist: string;
          youtube_url: string | null;
          mr_file_url: string | null;
          lyrics: string | null;
          user_id: string;
          is_busking_selected: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["songs"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["songs"]["Insert"]>;
      };
      schedules: {
        Row: {
          id: string;
          title: string;
          date: string;
          participation_fee: number;
          is_large_event: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["schedules"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["schedules"]["Insert"]>;
      };
      attendances: {
        Row: {
          id: string;
          schedule_id: string;
          user_id: string;
          status: AttendanceStatus;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["attendances"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["attendances"]["Insert"]>;
      };
      credit_transactions: {
        Row: {
          id: string;
          user_id: string;
          type: CreditTransactionType;
          amount: number;
          balance_after: number;
          description: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["credit_transactions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["credit_transactions"]["Insert"]>;
      };
      refund_requests: {
        Row: {
          id: string;
          user_id: string;
          schedule_id: string;
          reason: string;
          status: RefundStatus;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["refund_requests"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["refund_requests"]["Insert"]>;
      };
    };
  };
}
