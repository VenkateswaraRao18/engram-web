-- Run this in Supabase → SQL Editor

create table if not exists api_keys (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null unique,
  api_key     text not null,
  total_calls integer default 0 not null,
  created_at  timestamp with time zone default now() not null
);

-- Users can only read their own key (client-side dashboard query)
alter table api_keys enable row level security;

create policy "Users can view own key"
  on api_keys for select
  using (auth.uid() = user_id);

-- Service role (used by /api/provision-key) bypasses RLS automatically
