-- ============================================================
-- 길울림 (Street Resonance) — Supabase PostgreSQL Schema
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

create type user_role as enum ('admin', 'member');
create type attendance_status as enum ('attending', 'absent', 'undecided');
create type credit_transaction_type as enum ('deposit', 'withdraw');
create type refund_status as enum ('pending', 'approved', 'rejected');

-- ============================================================
-- TABLES
-- ============================================================

-- Users (extends Supabase auth.users)
create table public.users (
  id             uuid primary key references auth.users(id) on delete cascade,
  name           text not null,
  role           user_role not null default 'member',
  preferred_genre text[] default array['대중가요', '인디', '어쿠스틱'],
  vocal_range    text,
  current_credits integer not null default 0,
  can_give_lesson boolean not null default false,
  created_at     timestamptz not null default now()
);

-- Songs (곡 목록)
create table public.songs (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  artist              text not null,
  youtube_url         text,
  mr_file_url         text,
  lyrics              text,
  user_id             uuid not null references public.users(id) on delete cascade,
  is_busking_selected boolean not null default false,
  created_at          timestamptz not null default now()
);

-- Schedules (모임 일정)
create table public.schedules (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  date             timestamptz not null,
  -- 정기 모임 기본 참가비: 9000 크레딧 / 대형 이벤트는 0 또는 관리자 수동 입력
  participation_fee integer not null default 9000,
  is_large_event   boolean not null default false,
  created_at       timestamptz not null default now()
);

-- Attendances (참석 여부)
create table public.attendances (
  id          uuid primary key default gen_random_uuid(),
  schedule_id uuid not null references public.schedules(id) on delete cascade,
  user_id     uuid not null references public.users(id) on delete cascade,
  status      attendance_status not null default 'undecided',
  created_at  timestamptz not null default now(),
  unique (schedule_id, user_id)
);

-- Credit Transactions (크레딧 거래 내역)
create table public.credit_transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  type          credit_transaction_type not null,
  amount        integer not null check (amount > 0),
  balance_after integer not null,
  description   text,
  created_at    timestamptz not null default now()
);

-- Refund Requests (환불 요청)
create table public.refund_requests (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  schedule_id uuid not null references public.schedules(id) on delete cascade,
  reason      text not null,
  status      refund_status not null default 'pending',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.users enable row level security;
alter table public.songs enable row level security;
alter table public.schedules enable row level security;
alter table public.attendances enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.refund_requests enable row level security;

-- users: 본인 프로필 읽기/수정, 관리자는 전체 접근
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

create policy "users_select_admin" on public.users
  for select using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

create policy "users_insert_on_signup" on public.users
  for insert with check (auth.uid() = id);

-- songs: 인증된 사용자는 목록 읽기, 본인 곡만 쓰기
create policy "songs_select_authenticated" on public.songs
  for select using (auth.role() = 'authenticated');

create policy "songs_insert_own" on public.songs
  for insert with check (auth.uid() = user_id);

create policy "songs_update_own" on public.songs
  for update using (auth.uid() = user_id);

create policy "songs_delete_own" on public.songs
  for delete using (auth.uid() = user_id);

-- schedules: 인증된 사용자는 읽기, 관리자만 쓰기
create policy "schedules_select_authenticated" on public.schedules
  for select using (auth.role() = 'authenticated');

create policy "schedules_write_admin" on public.schedules
  for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- attendances: 본인 출석 읽기/쓰기, 관리자는 전체
create policy "attendances_select_own" on public.attendances
  for select using (auth.uid() = user_id);

create policy "attendances_select_admin" on public.attendances
  for select using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "attendances_write_own" on public.attendances
  for all using (auth.uid() = user_id);

-- credit_transactions: 본인 내역만
create policy "credit_transactions_select_own" on public.credit_transactions
  for select using (auth.uid() = user_id);

create policy "credit_transactions_select_admin" on public.credit_transactions
  for select using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "credit_transactions_insert_admin" on public.credit_transactions
  for insert with check (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- refund_requests: 본인 요청 읽기/생성, 관리자는 전체 처리
create policy "refund_requests_own" on public.refund_requests
  for select using (auth.uid() = user_id);

create policy "refund_requests_insert_own" on public.refund_requests
  for insert with check (auth.uid() = user_id);

create policy "refund_requests_admin" on public.refund_requests
  for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- 새 auth 사용자 가입 시 users 레코드 자동 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'member'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 크레딧 차감/적립 시 users.current_credits 자동 갱신
create or replace function public.sync_user_credits()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.users
  set current_credits = new.balance_after
  where id = new.user_id;
  return new;
end;
$$;

create trigger on_credit_transaction
  after insert on public.credit_transactions
  for each row execute procedure public.sync_user_credits();

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_songs_user_id on public.songs(user_id);
create index idx_attendances_schedule_id on public.attendances(schedule_id);
create index idx_attendances_user_id on public.attendances(user_id);
create index idx_credit_transactions_user_id on public.credit_transactions(user_id);
create index idx_credit_transactions_created_at on public.credit_transactions(created_at desc);
create index idx_refund_requests_user_id on public.refund_requests(user_id);
create index idx_schedules_date on public.schedules(date desc);
