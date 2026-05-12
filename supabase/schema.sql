-- Daruma Database Schema

-- Products Table
create table products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null check (category in ('pokemon','manga','comics')),
  set_name    text,                     -- expansión / editorial
  meta        text,                     -- "Special Illustration Rare · 199/197"
  tag         text,                     -- 'Chase' | 'Promo' | 'Alt Art' | 'Sellado' | 'Nuevo' | 'Deluxe' | …
  image_url   text,                     -- bucket storage
  available   boolean default true,
  featured    boolean default false,    -- chase / carta del mes
  created_at  timestamptz default now()
);
create index on products (category);
create index on products (featured) where featured;

-- Events Table
create table events (
  id          uuid primary key default gen_random_uuid(),
  starts_at   timestamptz not null,
  title       text not null,
  description text not null,
  badge       text,                     -- 'Pokémon' | 'Manga' | 'Lanzamiento' | …
  price_text  text,                     -- "12€" | "Gratis"
  capacity    int,
  created_at  timestamptz default now()
);
create index on events (starts_at);

-- Store Info (Singleton)
create table store_info (
  id          int primary key default 1 check (id = 1),
  address     text[],
  hours       jsonb,                    -- [["Lunes – Viernes", "17:00 – 21:00"], …]
  phone       text,
  email       text,
  socials     text[],
  map_embed_url text
);

-- RLS Policies
alter table products enable row level security;
create policy "public read" on products for select using (true);

alter table events enable row level security;
create policy "public read" on events for select using (true);

alter table store_info enable row level security;
create policy "public read" on store_info for select using (true);
