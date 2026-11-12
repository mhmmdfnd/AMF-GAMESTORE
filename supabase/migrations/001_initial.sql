-- AMF GAMESTORE schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'customer' check (role in ('customer','owner','admin','staff')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 120),
  game text not null check (game in ('PUBG Mobile','Mobile Legends','Free Fire','eFootball')),
  short_description text,
  description text,
  image_url text,
  price bigint not null check (price > 0),
  stock integer not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  user_id uuid not null references auth.users(id),
  product_id uuid references public.products(id) on delete set null,
  product_title text not null,
  game text not null,
  unit_price bigint not null check (unit_price > 0),
  total bigint not null check (total > 0),
  customer_name text not null,
  customer_phone text not null,
  customer_notes text,
  status text not null default 'awaiting_payment' check (status in ('awaiting_payment','payment_rejected','paid','processing','delivered','cancelled')),
  payment_method text not null default 'manual_transfer',
  payment_reference text,
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.payment_proofs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  storage_path text not null,
  payment_reference text,
  created_at timestamptz not null default now()
);
create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  actor_id uuid references auth.users(id),
  from_status text,
  to_status text not null,
  note text,
  created_at timestamptz not null default now()
);

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_active and p.role in ('owner','admin','staff')); $$;
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_active and p.role in ('owner','admin')); $$;
create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_active and p.role='owner'); $$;

-- Profile is auto-created as customer; do not allow self-selecting privileged roles.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public
as $$ begin insert into public.profiles(id,display_name,role) values(new.id,coalesce(new.raw_user_meta_data->>'display_name',''), 'customer'); return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.payment_proofs enable row level security;
alter table public.order_events enable row level security;

create policy "profile read self or staff" on public.profiles for select using (id=auth.uid() or public.is_staff());
create policy "owner manage profiles" on public.profiles for update using (public.is_owner()) with check (public.is_owner());
create policy "public read active products" on public.products for select using (is_active=true or public.is_admin());
create policy "admin insert products" on public.products for insert with check (public.is_admin());
create policy "admin update products" on public.products for update using (public.is_admin()) with check (public.is_admin());
create policy "admin delete products" on public.products for delete using (public.is_owner());

create policy "customer read own orders or staff" on public.orders for select using (user_id=auth.uid() or public.is_staff());
create policy "customer create own order" on public.orders for insert with check (user_id=auth.uid() and status='awaiting_payment');
create policy "staff update orders" on public.orders for update using (public.is_staff()) with check (public.is_staff());

create policy "customer read own proofs or staff" on public.payment_proofs for select using (user_id=auth.uid() or public.is_staff());
create policy "customer upload own proof" on public.payment_proofs for insert with check (user_id=auth.uid() and exists(select 1 from public.orders o where o.id=order_id and o.user_id=auth.uid() and o.status in ('awaiting_payment','payment_rejected')));
create policy "staff read order events" on public.order_events for select using (public.is_staff());
create policy "staff insert order events" on public.order_events for insert with check (public.is_staff());

-- Private bucket; objects are only accessible to owner path or staff.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('payment-proofs','payment-proofs',false,5242880,array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict(id) do nothing;
create policy "user upload own proof files" on storage.objects for insert to authenticated
with check (bucket_id='payment-proofs' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "user read own proof files or staff" on storage.objects for select to authenticated
using (bucket_id='payment-proofs' and ((storage.foldername(name))[1]=auth.uid()::text or public.is_staff()));
create policy "staff delete proof files" on storage.objects for delete to authenticated
using (bucket_id='payment-proofs' and public.is_admin());

-- First owner: create the user in Supabase Auth, then run this statement with their UUID.
-- update public.profiles set role='owner' where id='AUTH_USER_UUID';
