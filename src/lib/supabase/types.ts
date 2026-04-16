// Auto-generate with: npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
// Placeholder types until generation is run

export type UserRole = "admin" | "member";
export type AttendanceStatus = "attending" | "absent" | "undecided";
export type CreditTransactionType = "deposit" | "withdraw";
export type RefundStatus = "pending" | "approved" | "rejected";
export type PaymentType = "정모비" | "버스킹/공연비";
export type PaymentStatus = "pending" | "approved" | "rejected";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          real_name: string | null;
          email: string | null;
          role: UserRole;
          part: string | null;
          age: number | null;
          location: string | null;
          contact: string | null;
          available_days: string[] | null;
          instruments: string[] | null;
          preferred_genre: string[] | null;
          vocal_range: string | null;
          favorite_artist: string | null;
          signature_song: string | null;
          bio: string | null;
          current_credits: number;
          can_give_lesson: boolean;
          is_banned: boolean;
          is_chat_banned: boolean;
          profile_image_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          real_name?: string | null;
          role?: UserRole;
          part?: string | null;
          age?: number | null;
          location?: string | null;
          contact?: string | null;
          available_days?: string[] | null;
          instruments?: string[] | null;
          preferred_genre?: string[] | null;
          vocal_range?: string | null;
          favorite_artist?: string | null;
          signature_song?: string | null;
          bio?: string | null;
          current_credits?: number;
          can_give_lesson?: boolean;
          profile_image_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
        Relationships: [];
      };
      songs: {
        Row: {
          id: string;
          title: string;
          artist: string;
          youtube_url: string | null;
          mr_file_url: string | null;
          lyrics: string | null;
          song_key: string | null;
          tag: string | null;
          user_id: string;
          is_busking_selected: boolean;
          created_at: string;
        };
        Insert: {
          title: string;
          artist: string;
          user_id: string;
          youtube_url?: string | null;
          mr_file_url?: string | null;
          lyrics?: string | null;
          song_key?: string | null;
          tag?: string | null;
          is_busking_selected?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["songs"]["Insert"]>;
        Relationships: [];
      };
      schedules: {
        Row: {
          id: string;
          title: string;
          date: string;
          time: string | null;
          location: string | null;
          participation_fee: number;
          is_large_event: boolean;
          created_at: string;
        };
        Insert: {
          title: string;
          date: string;
          time?: string | null;
          location?: string | null;
          participation_fee?: number;
          is_large_event?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["schedules"]["Insert"]>;
        Relationships: [];
      };
      attendances: {
        Row: {
          id: string;
          schedule_id: string;
          user_id: string;
          status: AttendanceStatus;
          practice_note: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["attendances"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["attendances"]["Insert"]>;
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
      };
      payment_proofs: {
        Row: {
          id: string;
          user_id: string;
          payment_type: PaymentType;
          amount: number;
          memo: string | null;
          image_url: string | null;
          status: PaymentStatus;
          created_at: string;
        };
        Insert: {
          user_id: string;
          payment_type: PaymentType;
          amount: number;
          memo?: string | null;
          image_url?: string | null;
          status?: PaymentStatus;
        };
        Update: Partial<Database["public"]["Tables"]["payment_proofs"]["Insert"]>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          content: string;
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [];
      };
      push_subscriptions: {
        Row: { id: string; user_id: string; endpoint: string; p256dh: string; auth: string; created_at: string; };
        Insert: { user_id: string; endpoint: string; p256dh: string; auth: string; id?: string; };
        Update: Partial<Database["public"]["Tables"]["push_subscriptions"]["Insert"]>;
        Relationships: [];
      };
      direct_messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at: string;
          read_at: string | null;
        };
        Insert: {
          sender_id: string;
          receiver_id: string;
          content: string;
          id?: string;
          read_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["direct_messages"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
