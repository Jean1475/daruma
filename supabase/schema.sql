-- ============================================================
-- Daruma · Schema SQL
-- Ejecutar en el SQL Editor de Supabase tras crear el proyecto
-- ============================================================

-- Productos (stock de la tienda)
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  "set" text not null default '',
  description text not null default '',
  meta text not null default '',
  tags text[] not null default '{}',
  cat text not null check (cat in ('pokemon', 'manga', 'comics')),
  image_url text not null default '',
  pokemon_card_id text not null default '',
  price text not null default '',
  section text not null default 'stock' check (section in ('stock', 'carousel', 'hero')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Eventos (torneos, prereleases, clubs)
create table public.events (
  id uuid primary key default gen_random_uuid(),
  date_day text not null,
  date_month text not null,
  date_dow text not null,
  time text not null,
  title text not null,
  description text not null default '',
  price text not null default '',
  badge text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Perfiles de usuario (vinculados a auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'user' check (role in ('admin', 'user')),
  display_name text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

-- Helper que consulta profiles SIN pasar por RLS (evita recursion infinita)
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

alter table public.products enable row level security;
alter table public.events enable row level security;
alter table public.profiles enable row level security;

-- Products: lectura publica, escritura solo admins
create policy "Products: lectura publica"
  on public.products for select using (true);

create policy "Products: admins pueden insertar"
  on public.products for insert
  with check (public.is_admin());

create policy "Products: admins pueden actualizar"
  on public.products for update
  using (public.is_admin());

create policy "Products: admins pueden eliminar"
  on public.products for delete
  using (public.is_admin());

-- Events: mismo patron
create policy "Events: lectura publica"
  on public.events for select using (true);

create policy "Events: admins pueden insertar"
  on public.events for insert
  with check (public.is_admin());

create policy "Events: admins pueden actualizar"
  on public.events for update
  using (public.is_admin());

create policy "Events: admins pueden eliminar"
  on public.events for delete
  using (public.is_admin());

-- Profiles: cada usuario ve su propio perfil, admins ven todos
create policy "Profiles: ver propio perfil o admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

-- ============================================================
-- Triggers
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.update_updated_at();

create trigger events_updated_at
  before update on public.events
  for each row execute function public.update_updated_at();

-- ============================================================
-- Seed data (mismos datos que data.ts)
-- ============================================================

insert into public.products (name, "set", meta, tags, cat, image_url, pokemon_card_id, price, section) values
  ('Charizard ex · SIR',       'Obsidian Flames',   'Special Illustration Rare', ARRAY['Chase'],    'pokemon', 'https://assets.tcgdex.net/en/sv/sv03/199', 'sv03-199', '85€', 'hero'),
  ('Pikachu with Grey Felt',   'Van Gogh Promo',    'Promo · 085/SVP',           ARRAY['Promo'],    'pokemon', 'https://assets.tcgdex.net/en/sv/svp/085', 'svp-085', '120€', 'carousel'),
  ('Umbreon V Alt Art',        'Lost Origin',       'Alt Art · 215/196',         ARRAY['Alt Art'],  'pokemon', 'https://assets.tcgdex.net/en/swsh/swsh11/215', 'swsh11-215', '65€', 'carousel'),
  ('Mewtwo VSTAR Gold',        'Pokemon GO',        'Hyper Rare · 086/078',      ARRAY['Holo'],     'pokemon', 'https://assets.tcgdex.net/en/swsh/pgo/086', 'pgo-086', '25€', 'stock'),
  ('Lugia V Alt Art',          'Silver Tempest',    'Alt Art · 186/195',         ARRAY['Alt Art'],  'pokemon', 'https://assets.tcgdex.net/en/swsh/swsh12pt5/186', 'swsh12pt5-186', '90€', 'carousel'),
  ('Booster Box · 151',        'Scarlet & Violet',  'Caja · 36 sobres',          ARRAY['Sellado'],  'pokemon', '', '', '165€', 'stock'),
  ('ETB Surging Sparks',       'Surging Sparks',    'Elite Trainer Box',         ARRAY['Sellado'],  'pokemon', '', '', '55€', 'stock'),
  ('Rayquaza VMAX',            'Evolving Skies',    'Alt Art · 218/203',         ARRAY['Alt Art'],  'pokemon', 'https://assets.tcgdex.net/en/swsh/swsh7/218', 'swsh7-218', '150€', 'carousel'),
  ('Chainsaw Man · Vol. 16',   'Norma',             'Tomo individual',           ARRAY['Nuevo'],    'manga',   '', '', '9€', 'stock'),
  ('Jujutsu Kaisen · Vol. 26', 'Norma',             'Tomo individual',           ARRAY['Nuevo'],    'manga',   '', '', '9€', 'stock'),
  ('Berserk Deluxe · Vol. 7',  'Panini',            'Edicion Deluxe · 700pp',    ARRAY['Deluxe'],   'manga',   '', '', '35€', 'stock'),
  ('One Piece · Tomo 109',     'Planeta',           'Edicion 3 en 1',            ARRAY['Nuevo'],    'manga',   '', '', '8€', 'stock'),
  ('Vinland Saga · Vol. 13',   'Planeta',           'Tomo individual',           ARRAY['Repo'],     'manga',   '', '', '9€', 'stock'),
  ('Vagabond · Kanzenban 12',  'Ivrea',             'Edicion Kanzenban',         ARRAY['Deluxe'],   'manga',   '', '', '22€', 'stock'),
  ('Saga · Volumen 11',        'Image · Planeta',   'TPB · 152pp',               ARRAY['Nuevo'],    'comics',  '', '', '15€', 'stock'),
  ('Daredevil: Born Again',    'Marvel',            'Marvel Premiere',           ARRAY['Clasico'],  'comics',  '', '', '18€', 'stock'),
  ('Sandman · Tomo I',         'ECC',               'Edicion Deluxe',            ARRAY['Deluxe'],   'comics',  '', '', '28€', 'stock'),
  ('The Boys · Omnibus 3',     'Norma',             'Omnibus · 480pp',           ARRAY['Omnibus'],  'comics',  '', '', '32€', 'stock'),
  ('Watchmen · Vol. 1',        'ECC',               'Edicion coleccionista',     ARRAY['Clasico'],  'comics',  '', '', '22€', 'stock'),
  ('Paper Girls · Integral',   'Planeta',           'Tomo unico · 800pp',        ARRAY['Integral'], 'comics',  '', '', '30€', 'stock');

-- ============================================================
-- Configuración del sitio web
-- ============================================================

create table public.site_config (
  key text primary key,
  value jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

alter table public.site_config enable row level security;

create policy "Site config: lectura publica"
  on public.site_config for select using (true);

create policy "Site config: admins pueden insertar"
  on public.site_config for insert
  with check (public.is_admin());

create policy "Site config: admins pueden actualizar"
  on public.site_config for update
  using (public.is_admin());

create trigger site_config_updated_at
  before update on public.site_config
  for each row execute function public.update_updated_at();

insert into public.site_config (key, value) values
  ('stripe_items', '["ABIERTO AHORA · MAR–DOM 10:00–14:00","★ Torneo Pokémon · Sábado 16 May","Nueva reposición · Obsidian Flames","⊛ COMPRAMOS COLECCIONES ⊛","Prerelease Phantasmal Flames · 30 May","Manga book club · Berserk · 06 Jun","営業中 · Leganés · Madrid"]'),
  ('hero_slides', '[{"set":"Abyss Eye","kicker":"Lo último en llegar","kickerJp":"最新入荷","cta":"Ver stock","href":"#stock","imageUrl":"/fotos/BANNERS1_5bac1109-e710-489f-bbdf-3fec13f9d50f.webp"},{"set":"Chaos Rising","kicker":"Nuevo set disponible","kickerJp":"新セット発売","cta":"Ver stock","href":"#stock","imageUrl":"/fotos/BANNERS1_ee05748a-9e6e-47ff-9f32-a71771a175e2.webp"},{"set":"Equilibrio Perfecto","kicker":"En tienda ahora","kickerJp":"店内在庫あり","cta":"Preguntanos","href":"#visit","imageUrl":"/fotos/BANNERS1_efa8d084-c4cd-4540-9fb0-3a5c97fbb43c.webp"}]')
on conflict (key) do nothing;

-- ============================================================
-- Storage (imágenes de productos)
-- ============================================================

-- Bucket público para imágenes subidas desde el dashboard
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "Product images: lectura publica"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Product images: admins pueden subir"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "Product images: admins pueden actualizar"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());

create policy "Product images: admins pueden eliminar"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());

insert into public.events (date_day, date_month, date_dow, time, title, description, price, badge) values
  ('16', 'MAY', 'Sab', '16:00', 'Torneo Pokemon · Standard',      'Formato Standard. Premios en cartas selladas y producto del nuevo set. 16 plazas.', '12 EUR', 'Pokemon'),
  ('24', 'MAY', 'Dom', '11:00', 'Liga Junior · Iniciacion',       'Pensado para peques que empiezan. Prestamos mazos. Padres y madres bienvenidos.',   'Gratis', 'Pokemon'),
  ('30', 'MAY', 'Sab', '17:00', 'Prerelease · Phantasmal Flames', 'Juega con el nuevo set una semana antes de que salga al mercado. Llevate los sobres.', '30 EUR', 'Lanzamiento'),
  ('06', 'JUN', 'Sab', '18:00', 'Manga Book Club · Berserk',      'Tertulia sobre los primeros tomos de Berserk. Trae el tuyo o leelo aqui. Cafe incluido.', 'Gratis', 'Manga');
