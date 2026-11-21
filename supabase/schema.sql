-- Jalankan seluruh SQL ini di Supabase SQL Editor.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text default '',
  price bigint not null check (price >= 0),
  image_url text,
  stock integer not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_contact text not null,
  product_id uuid references public.products(id),
  product_name text not null,
  quantity integer not null default 1 check (quantity > 0),
  total bigint not null check (total >= 0),
  notes text,
  status text not null default 'pending'
    check (status in ('pending','waiting_payment','paid','processing','completed','cancelled')),
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Publik hanya dapat membaca produk aktif.
create policy "Public can view active products"
on public.products for select
using (is_active = true);

-- Jangan aktifkan insert/update/delete publik untuk produk atau pesanan.
-- Buat operasi admin melalui server route dengan SUPABASE_SERVICE_ROLE_KEY
-- yang hanya disimpan sebagai environment variable server-side.
