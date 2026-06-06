export const POKEMON_STOCK = [
  { id: 'p1', name: 'Charizard ex · SIR',       set: 'Obsidian Flames',   meta: 'Special Illustration Rare', tags: ['Chase'],           image_url: 'https://assets.tcgdex.net/en/sv/sv03/199', pokemon_card_id: 'sv03-199', price: '85€',  section: 'hero'     as const },
  { id: 'p2', name: 'Pikachu with Grey Felt',   set: 'Van Gogh Promo',     meta: 'Promo · 085/SVP',          tags: ['Promo'],           image_url: 'https://assets.tcgdex.net/en/sv/svp/085', pokemon_card_id: 'svp-085', price: '120€', section: 'carousel' as const },
  { id: 'p3', name: 'Umbreon V Alt Art',        set: 'Lost Origin',        meta: 'Alt Art · 215/196',        tags: ['Alt Art'],         image_url: 'https://assets.tcgdex.net/en/swsh/swsh11/215', pokemon_card_id: 'swsh11-215', price: '65€',  section: 'carousel' as const },
  { id: 'p4', name: 'Mewtwo VSTAR Gold',        set: 'Pokémon GO',         meta: 'Hyper Rare · 086/078',     tags: ['Holo'],            image_url: 'https://assets.tcgdex.net/en/swsh/pgo/086', pokemon_card_id: 'pgo-086', price: '25€',  section: 'stock'    as const },
  { id: 'p5', name: 'Lugia V Alt Art',          set: 'Silver Tempest',     meta: 'Alt Art · 186/195',        tags: ['Alt Art'],         image_url: 'https://assets.tcgdex.net/en/swsh/swsh12pt5/186', pokemon_card_id: 'swsh12pt5-186', price: '90€',  section: 'carousel' as const },
  { id: 'p6', name: 'Booster Box · 151',        set: 'Scarlet & Violet',   meta: 'Caja · 36 sobres',         tags: ['Sellado'],         image_url: '', pokemon_card_id: '', price: '165€', section: 'stock'    as const },
  { id: 'p7', name: 'ETB Surging Sparks',       set: 'Surging Sparks',     meta: 'Elite Trainer Box',        tags: ['Sellado'],         image_url: '', pokemon_card_id: '', price: '55€',  section: 'stock'    as const },
  { id: 'p8', name: 'Rayquaza VMAX',            set: 'Evolving Skies',     meta: 'Alt Art · 218/203',        tags: ['Alt Art'],         image_url: 'https://assets.tcgdex.net/en/swsh/swsh7/218', pokemon_card_id: 'swsh7-218', price: '150€', section: 'carousel' as const },
];

export const MANGA_STOCK = [
  { id: 'm1', name: 'Chainsaw Man · Vol. 16',   set: 'Norma',              meta: 'Tomo individual',          tags: ['Nuevo'],   image_url: '', pokemon_card_id: '', price: '9€',  section: 'stock' as const },
  { id: 'm2', name: 'Jujutsu Kaisen · Vol. 26', set: 'Norma',              meta: 'Tomo individual',          tags: ['Nuevo'],   image_url: '', pokemon_card_id: '', price: '9€',  section: 'stock' as const },
  { id: 'm3', name: 'Berserk Deluxe · Vol. 7',  set: 'Panini',             meta: 'Edición Deluxe · 700pp',   tags: ['Deluxe'],  image_url: '', pokemon_card_id: '', price: '35€', section: 'stock' as const },
  { id: 'm4', name: 'One Piece · Tomo 109',     set: 'Planeta',            meta: 'Edición 3 en 1',           tags: ['Nuevo'],   image_url: '', pokemon_card_id: '', price: '8€',  section: 'stock' as const },
  { id: 'm5', name: 'Vinland Saga · Vol. 13',   set: 'Planeta',            meta: 'Tomo individual',          tags: ['Repo'],    image_url: '', pokemon_card_id: '', price: '9€',  section: 'stock' as const },
  { id: 'm6', name: 'Vagabond · Kanzenban 12',  set: 'Ivrea',              meta: 'Edición Kanzenban',        tags: ['Deluxe'],  image_url: '', pokemon_card_id: '', price: '22€', section: 'stock' as const },
];

export const COMICS_STOCK = [
  { id: 'c1', name: 'Saga · Volumen 11',        set: 'Image · Planeta',    meta: 'TPB · 152pp',              tags: ['Nuevo'],    image_url: '', pokemon_card_id: '', price: '15€', section: 'stock' as const },
  { id: 'c2', name: 'Daredevil: Born Again',    set: 'Marvel',             meta: 'Marvel Premiere',          tags: ['Clásico'],  image_url: '', pokemon_card_id: '', price: '18€', section: 'stock' as const },
  { id: 'c3', name: 'Sandman · Tomo I',         set: 'ECC',                meta: 'Edición Deluxe',           tags: ['Deluxe'],   image_url: '', pokemon_card_id: '', price: '28€', section: 'stock' as const },
  { id: 'c4', name: 'The Boys · Omnibus 3',     set: 'Norma',              meta: 'Omnibus · 480pp',          tags: ['Omnibus'],  image_url: '', pokemon_card_id: '', price: '32€', section: 'stock' as const },
  { id: 'c5', name: 'Watchmen · Vol. 1',        set: 'ECC',                meta: 'Edición coleccionista',    tags: ['Clásico'],  image_url: '', pokemon_card_id: '', price: '22€', section: 'stock' as const },
  { id: 'c6', name: 'Paper Girls · Integral',   set: 'Planeta',            meta: 'Tomo único · 800pp',       tags: ['Integral'], image_url: '', pokemon_card_id: '', price: '30€', section: 'stock' as const },
];

export const ALL_STOCK = [
  ...POKEMON_STOCK.map((x) => ({ ...x, cat: 'pokemon' })),
  ...MANGA_STOCK.map((x) => ({ ...x, cat: 'manga' })),
  ...COMICS_STOCK.map((x) => ({ ...x, cat: 'comics' })),
];

export const POKE_SETS = ['Todas', 'Scarlet & Violet 151', 'Obsidian Flames', 'Lost Origin', 'Silver Tempest', 'Pokémon GO', 'Surging Sparks', 'Evolving Skies', 'Van Gogh Promo'];

export const EVENTS = [
  {
    id: 'e1',
    date: { d: '16', m: 'MAY', dow: 'Sáb' },
    when: '16:00',
    title: 'Torneo Pokémon · Standard',
    desc: 'Formato Standard. Premios en cartas selladas y producto del nuevo set. 16 plazas.',
    price: '12€',
    badge: 'Pokémon',
  },
  {
    id: 'e2',
    date: { d: '24', m: 'MAY', dow: 'Dom' },
    when: '11:00',
    title: 'Liga Junior · Iniciación',
    desc: 'Pensado para peques que empiezan. Prestamos mazos. Padres y madres bienvenidos.',
    price: 'Gratis',
    badge: 'Pokémon',
  },
  {
    id: 'e3',
    date: { d: '30', m: 'MAY', dow: 'Sáb' },
    when: '17:00',
    title: 'Prerelease · Phantasmal Flames',
    desc: 'Juega con el nuevo set una semana antes de que salga al mercado. Llévate los sobres.',
    price: '30€',
    badge: 'Lanzamiento',
  },
  {
    id: 'e4',
    date: { d: '06', m: 'JUN', dow: 'Sáb' },
    when: '18:00',
    title: 'Manga Book Club · Berserk',
    desc: 'Tertulia sobre los primeros tomos de Berserk. Trae el tuyo o léelo aquí. Café incluido.',
    price: 'Gratis',
    badge: 'Manga',
  },
];

export const VISIT = {
  address: ['C. de Butarque, 14 · Puerta B, Local 3', '28911 Leganés, Madrid'],
  hours: [
    ['Mar – Vie', '10:00–14:00 / 17:00–20:30'],
    ['Sábado',   '10:00–14:00 / 17:00–20:30'],
    ['Domingo',  '10:00–14:00'],
    ['Lunes',    'Cerrado'],
  ],
  phone: '+34 658 48 31 82',
  email: 'hola@pokétienda.es',
  socials: ['@pokétienda', '@pokétiendaes'],
};
