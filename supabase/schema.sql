create table if not exists public.user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  favorites jsonb not null default '[]'::jsonb,
  visited jsonb not null default '[]'::jsonb,
  requests jsonb not null default '[]'::jsonb,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_state enable row level security;

revoke all on table public.user_state from anon;
grant select, insert, update, delete on table public.user_state to authenticated;

drop policy if exists "Users can read their own MyLombok state" on public.user_state;
create policy "Users can read their own MyLombok state"
on public.user_state for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own MyLombok state" on public.user_state;
create policy "Users can create their own MyLombok state"
on public.user_state for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own MyLombok state" on public.user_state;
create policy "Users can update their own MyLombok state"
on public.user_state for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own MyLombok state" on public.user_state;
create policy "Users can delete their own MyLombok state"
on public.user_state for delete
to authenticated
using ((select auth.uid()) = user_id);
