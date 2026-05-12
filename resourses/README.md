# Handoff · Daruma — Landing (Next.js + Supabase + Tailwind)

## Overview
Landing pública para **Daruma**, tienda física en Bilbao de cartas Pokémon, manga y cómics. **No vende online** — la web es escaparate: stock destacado, próximos eventos/torneos y cómo visitarnos. Punto fuerte: cartas Pokémon (con "carta del mes" destacada).

## About the Design Files
Los archivos `.html` / `.jsx` adjuntos son **referencias de diseño** prototipadas en HTML + React (Babel en el browser, sin build). **No es código de producción**. La tarea es **reproducir estos diseños en tu stack (Next.js 14 App Router + Supabase + Tailwind)** usando los patrones del propio codebase.

Aspectos a trasladar:
1. **Visual**: tokens (colores, tipografía, radios, espaciados) y estructura de secciones.
2. **Contenido dinámico**: stock + eventos vendrán de Supabase, no del array hard-coded.
3. **Filtros e interacción**: replicar lógica de filtrado y buscador (client-side sobre data de Supabase).

## Fidelity
**Hi-fi**. Colores, tipografías y espaciados son los definitivos. Las imágenes son placeholders monospace deliberados ("product shot") — la tienda debe subir fotos reales antes de pasar a producción.

## Variantes
Hay **3 direcciones visuales** en el canvas. Cada `<DCArtboard>` en `Daruma Landing.html` es una variante completa:

| ID  | Nombre              | DNA                                                        |
|-----|---------------------|------------------------------------------------------------|
| V1  | Editorial crema     | Base neutral, papel cálido, tipo referencia off.vstore     |
| V2  | **Azul Daruma**     | **Variante elegida por el cliente** — cobalto inmersivo + dorado |
| V3  | Vitrina oscura      | Galería de coleccionista, fondo casi negro + dorado        |

> **Implementar V2 primero**. V1/V3 se conservan como rama alternativa o tema oscuro futuro.

---

## Stack target

- **Next.js 14** App Router, Server Components donde se pueda (stock + eventos = server-fetched).
- **Supabase** para datos (tablas `products`, `events`, `store_info`).
- **Tailwind CSS** con tokens en `tailwind.config.ts`.
- **shadcn/ui** opcional para Inputs/Select/Button — pero overridea estilos para que matcheen el diseño.

---

## Design Tokens

Añadir a `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      daruma: {
        blue:      'oklch(38% 0.16 263)',  // #1e3aa3 aprox · acento principal V2
        'blue-dk': 'oklch(28% 0.14 263)',
        gold:      'oklch(78% 0.13 88)',   // #d4a73a aprox · acento dorado
        'gold-sf': 'oklch(85% 0.09 88)',
        cream:     '#f4efe6',              // fondo papel cálido V2
        off:       '#f8f6f1',              // fondo claro V1
        ink:       '#0e1538',              // texto sobre crema (azul muy oscuro)
        coal:      '#0d0a0c',              // fondo V3 oscuro
        carbon:    '#13100f',              // fondo V1 modo oscuro
      },
    },
    fontFamily: {
      display: ['"Bricolage Grotesque"', 'Helvetica Neue', 'system-ui', 'sans-serif'],
      sans:    ['"DM Sans"', 'Helvetica Neue', 'system-ui', 'sans-serif'],
      mono:    ['"JetBrains Mono"', 'ui-monospace', 'SF Mono', 'monospace'],
    },
    borderRadius: {
      // V2 usa esquinas casi rectas, muy editorial
      'card': '4px',
    },
  },
},
```

Cargar fuentes con `next/font/google`:

```ts
// app/layout.tsx
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from 'next/font/google';

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', weight: ['400','500','600','700'] });
const sans    = DM_Sans({ subsets: ['latin'], variable: '--font-sans', weight: ['400','500','600'] });
const mono    = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400','500','600'] });
```

### Escala tipográfica (V2)

| Uso                | Familia   | Tamaño px | Peso | Letter-spacing | Notas |
|--------------------|-----------|-----------|------|----------------|-------|
| H1 hero            | display   | 100       | 600  | -4             | line-height 0.9, textWrap balance, `<em>` en italic dorado |
| H2 section         | display   | 44        | 600  | -1.2           | line-height 1 |
| H3 card title      | display   | 17–22     | 600  | -0.2 a -0.4    | line-height 1.15 |
| Body / párrafo     | sans      | 16–19     | 400  | 0              | line-height 1.5–1.55, textWrap pretty |
| Meta / etiqueta    | mono      | 10–11     | 500  | 1.5–2          | uppercase |
| Botón              | sans      | 14–15     | 500–600 | 0           | padding 14–16 / 24–26 |

### Espaciado
- Sección padding: `96px 56px`.
- Hero V2 padding: `88px 56px 96px`.
- Grid stock: 4 cols, gap 24.
- Grid eventos: 1 col, gap 16.

---

## Estructura de secciones (V2)

1. **Nav sticky** — logo Daruma + wordmark, items (Stock, Eventos, Visítanos, Sobre), badge dorado **"solo en tienda · no online"**.
2. **Hero azul** — H1 grande, párrafo, dos CTAs (`Ver el stock` dorado primario · `Visítanos` outline). Daruma silueta sutil 10% opacidad en fondo (`assets/daruma-logo.png`). A la derecha: card translúcida con "Carta del mes" (Charizard ex SIR placeholder).
3. **Filosofía** (banda blanca) — kicker mono + H2 + sub. Texto explicando la propuesta: tienda física para afición física.
4. **Stock destacado** — filtros (categoría pills [Todo/Pokémon/Manga/Cómics] + select expansión + buscador) + grid 4 col de `ProductCard`. Cada card: placeholder + tag (Chase/Promo/Alt Art/Sellado/Nuevo/Deluxe), título, set, meta (numeración / formato), línea "● disponible en tienda" + "ver →".
5. **Próximos eventos** — bloque de tarjetas horizontales: cuadro de fecha (DOW grande/día gigante/mes), badge categoría, hora, título, descripción corta, precio + botón "Apúntate →". La primera tarjeta puede usar fondo dorado en el cuadro de fecha para destacar.
6. **Cómo visitarnos** — 2 columnas: mapa abstracto SVG (substituir por iframe Google Maps embed) + bloques verticales (Dirección, Horario, Contacto).
7. **Footer** — wordmark + tagline, 3 columnas (Tienda, Comunidad, Contacto), pie con copyright + "sin tienda online · solo presencial".

---

## Interacciones

- **Filtros**: state client-side (`useState`) sobre la data ya cargada de Supabase. Al cambiar categoría, expansión o query → filtrar in-memory.
- **Buscador**: case-insensitive sobre `name + set + meta` (concat).
- **Reveal on scroll**: clase `.reveal` → `.in` con IntersectionObserver. Transición 0.8s ease-out (opacity + translateY 20px → 0).
- **Hover botones/cards**: `transition` 0.15–0.25s. Cards: leve `scale(1.005)` o `box-shadow`.
- **Anchor scroll**: nav items linkan a `#stock`, `#events`, `#visit` con `scroll-behavior: smooth` en `<html>`.

---

## Modelo de datos (Supabase)

### `products`
```sql
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
```

### `events`
```sql
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
```

### `store_info` (singleton)
```sql
create table store_info (
  id          int primary key default 1 check (id = 1),
  address     text[],
  hours       jsonb,                    -- [["Lunes – Viernes", "17:00 – 21:00"], …]
  phone       text,
  email       text,
  socials     text[],
  map_embed_url text
);
```

### RLS
Las tres tablas son **read-only públicas** (anon select). Mutaciones detrás de auth + role admin.

```sql
alter table products enable row level security;
create policy "public read" on products for select using (true);
-- mismo patrón en events y store_info.
```

### Fetch en Server Component

```tsx
// app/page.tsx
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = createClient();
  const [{ data: products }, { data: events }, { data: info }] = await Promise.all([
    supabase.from('products').select('*').order('featured', { ascending: false }).limit(24),
    supabase.from('events').select('*').gte('starts_at', new Date().toISOString()).order('starts_at').limit(6),
    supabase.from('store_info').select('*').single(),
  ]);
  return <Landing products={products ?? []} events={events ?? []} info={info!} />;
}
```

Los filtros del stock se hacen en un **Client Component** hijo que recibe `products` como prop.

---

## Componentes a crear (sugerencia de árbol)

```
components/
  landing/
    Nav.tsx
    HeroAzul.tsx
    FilosofiaBanda.tsx
    StockSection.tsx          ← 'use client' (filtros)
      FiltersBar.tsx
      ProductCard.tsx
    EventsSection.tsx
      EventCard.tsx
    VisitSection.tsx
      MapEmbed.tsx
      VisitBlock.tsx
    Footer.tsx
  ui/
    Pill.tsx                  ← chip / tag genérico
    ProductPlaceholder.tsx    ← fallback monospace si image_url null
```

---

## Assets

| Archivo                       | Origen                  | Uso                                       |
|-------------------------------|-------------------------|-------------------------------------------|
| `assets/daruma-logo.png`      | Logo del cliente        | Mark en nav + silueta de fondo en hero V2 |
| Placeholders monospace        | Generados en CSS+SVG    | Reemplazar por fotos reales del producto  |

---

## Files en este bundle

- `Daruma Landing.html` — entry del prototipo
- `landing.jsx` — composición + temas (THEMES.v2 es lo que implementas)
- `sections.jsx` — átomos compartidos (Nav, ProductCard, EventCard, MapPlaceholder, Footer)
- `data.jsx` — datos de ejemplo (sirven como seed para Supabase)
- `assets/daruma-logo.png` — logo
- `screenshots/` *(si se incluyen)*

Cualquier duda visual, abre `Daruma Landing.html` localmente (necesita servir los `.jsx` por HTTP — `npx serve .` vale) y consulta la variante V2.
