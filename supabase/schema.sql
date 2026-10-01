-- Hi Care: Supabase > SQL Editor 에 통째로 붙여넣고 Run (여러 번 실행해도 안전)

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  role text not null default 'user' check (role in ('user','admin')),
  status text not null default 'active' check (status in ('active','suspended')),
  created_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null check (char_length(action) <= 50),
  condition_id text,
  keyword_id text,
  meta jsonb,
  created_at timestamptz not null default now()
);
create index if not exists activity_logs_created_idx on public.activity_logs (created_at desc);
create index if not exists activity_logs_user_idx on public.activity_logs (user_id);

-- 권한 확인 함수 (RLS 재귀 방지를 위해 security definer)
create or replace function public.is_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and status = 'active');
$$;
create or replace function public.is_active() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and status = 'active');
$$;

-- ─────────────────────────────────────────────────────────────
-- 관리자 회원가입 코드 (서버에서 검증 / 브라우저 코드에는 정답이 없음)
-- 코드 원문이 아니라 SHA-256 해시만 저장합니다. RLS를 켜고 정책을 만들지 않아
-- API(anon/authenticated)로는 이 테이블을 읽을 수 없습니다.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.app_secrets (
  key text primary key,
  value text not null
);
alter table public.app_secrets enable row level security;
revoke all on public.app_secrets from anon, authenticated;

-- 관리자 코드 = 35957996 (의 SHA-256 해시)
insert into public.app_secrets (key, value)
values ('admin_signup_code_sha256', '73cba0abc653e569d0714b49ec9d60e3849b97f5dd50c0accb3cebbac5dc8096')
on conflict (key) do update set value = excluded.value;
-- ▲ 코드를 바꾸려면: 새 코드의 SHA-256 해시(소문자 hex)로 위 값을 바꿔 다시 실행하세요.
--   (예: select encode(sha256(convert_to('새코드','utf8')),'hex');)

-- 가입 직전: 관리자 코드를 검증하고 역할(signup_role)을 서버가 직접 결정
--  · admin_code 없음  → 이용자(user)
--  · admin_code 일치  → 관리자(admin)
--  · admin_code 불일치 → 가입 거부(예외)
-- 클라이언트가 보낸 signup_role 값은 항상 덮어써서 위조를 막고, 코드 원문은 메타데이터에서 제거합니다.
create or replace function public.prepare_new_user() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_code text := nullif(btrim(coalesce(new.raw_user_meta_data->>'admin_code', '')), '');
  v_hash text;
  v_role text := 'user';
begin
  if v_code is not null then
    select value into v_hash from public.app_secrets where key = 'admin_signup_code_sha256';
    if v_hash is not null and encode(sha256(convert_to(v_code, 'utf8')), 'hex') = v_hash then
      v_role := 'admin';
    else
      raise exception 'invalid admin code';
    end if;
  end if;
  new.raw_user_meta_data :=
    (coalesce(new.raw_user_meta_data, '{}'::jsonb) - 'admin_code' - 'signup_role')
    || jsonb_build_object('signup_role', v_role);
  return new;
end $$;
drop trigger if exists on_auth_user_prepare on auth.users;
create trigger on_auth_user_prepare before insert on auth.users
  for each row execute function public.prepare_new_user();

-- 회원가입 시 profiles 행 자동 생성 (역할은 위 트리거가 정한 signup_role 사용)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    case when new.raw_user_meta_data->>'signup_role' = 'admin' then 'admin' else 'user' end
  );
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- 일반 회원이 자기 role/status를 바꾸지 못하게 차단 (SQL Editor 실행은 auth.uid()가 null이라 허용)
create or replace function public.protect_profile() returns trigger
language plpgsql as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role; new.status := old.status; new.email := old.email;
  end if;
  return new;
end $$;
drop trigger if exists protect_profile_cols on public.profiles;
create trigger protect_profile_cols before update on public.profiles
  for each row execute function public.protect_profile();

-- Row Level Security: 이게 실제 보안의 핵심입니다
alter table public.profiles enable row level security;
alter table public.activity_logs enable row level security;

drop policy if exists profiles_select on public.profiles;
drop policy if exists profiles_update on public.profiles;
drop policy if exists logs_insert on public.activity_logs;
drop policy if exists logs_select on public.activity_logs;

create policy profiles_select on public.profiles for select
  using (id = auth.uid() or public.is_admin());
create policy profiles_update on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
create policy logs_insert on public.activity_logs for insert
  with check (user_id = auth.uid() and public.is_active());
create policy logs_select on public.activity_logs for select
  using (user_id = auth.uid() or public.is_admin());
-- DELETE 정책 없음 = API로는 아무도 삭제 불가

-- 건강관리 콘텐츠 (로그인한 정상 회원만 읽기 가능)
create table if not exists public.health_content (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.health_content enable row level security;
drop policy if exists content_select on public.health_content;
drop policy if exists content_admin_write on public.health_content;
create policy content_select on public.health_content for select using (public.is_active());
create policy content_admin_write on public.health_content for all
  using (public.is_admin()) with check (public.is_admin());

-- ▼ 이제 사이트의 "관리자 회원가입"에서 관리자 코드를 입력하면 바로 관리자가 됩니다.
--   (수동으로 지정하고 싶다면: update public.profiles set role = 'admin' where email = '내이메일@example.com';)

-- ─────────────────────────────────────────────────────────────
-- 로그인 오류 정리 (여러 번 실행해도 안전)
-- 1) 이메일 인증을 쓰지 않으므로, 예전에 가입해 인증 대기 중인 계정도 모두 인증 완료 처리
--    ("Email not confirmed" 로그인 오류 방지)
update auth.users set email_confirmed_at = now() where email_confirmed_at is null;

-- 2) 가입은 됐는데 profiles 행이 없는 계정 복구
--    (profiles 가 없으면 RLS 때문에 콘텐츠를 못 읽고 로그인 후 오류가 납니다)
insert into public.profiles (id, email, name)
select u.id, u.email, coalesce(u.raw_user_meta_data->>'name', '')
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);
