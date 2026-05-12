export const POKEMON_STOCK = [
  { id: 'p1', name: 'Charizard ex · SIR',       set: 'Obsidian Flames',   meta: 'Special Illustration Rare', tag: 'Chase' },
  { id: 'p2', name: 'Pikachu with Grey Felt',   set: 'Van Gogh Promo',     meta: 'Promo · 085/SVP',          tag: 'Promo' },
  { id: 'p3', name: 'Umbreon V Alt Art',        set: 'Lost Origin',        meta: 'Alt Art · 215/196',        tag: 'Alt Art' },
  { id: 'p4', name: 'Mewtwo VSTAR Gold',        set: 'Pokémon GO',         meta: 'Hyper Rare · 086/078',     tag: 'Holo' },
  { id: 'p5', name: 'Lugia V Alt Art',          set: 'Silver Tempest',     meta: 'Alt Art · 186/195',        tag: 'Alt Art' },
  { id: 'p6', name: 'Booster Box · 151',        set: 'Scarlet & Violet',   meta: 'Caja · 36 sobres',         tag: 'Sellado' },
  { id: 'p7', name: 'ETB Surging Sparks',       set: 'Surging Sparks',     meta: 'Elite Trainer Box',        tag: 'Sellado' },
  { id: 'p8', name: 'Rayquaza VMAX',            set: 'Evolving Skies',     meta: 'Alt Art · 218/203',        tag: 'Alt Art' },
];

export const MANGA_STOCK = [
  { id: 'm1', name: 'Chainsaw Man · Vol. 16',   set: 'Norma',              meta: 'Tomo individual',          tag: 'Nuevo' },
  { id: 'm2', name: 'Jujutsu Kaisen · Vol. 26', set: 'Norma',              meta: 'Tomo individual',          tag: 'Nuevo' },
  { id: 'm3', name: 'Berserk Deluxe · Vol. 7',  set: 'Panini',             meta: 'Edición Deluxe · 700pp',   tag: 'Deluxe' },
  { id: 'm4', name: 'One Piece · Tomo 109',     set: 'Planeta',            meta: 'Edición 3 en 1',           tag: 'Nuevo' },
  { id: 'm5', name: 'Vinland Saga · Vol. 13',   set: 'Planeta',            meta: 'Tomo individual',          tag: 'Repo' },
  { id: 'm6', name: 'Vagabond · Kanzenban 12',  set: 'Ivrea',              meta: 'Edición Kanzenban',        tag: 'Deluxe' },
];

export const COMICS_STOCK = [
  { id: 'c1', name: 'Saga · Volumen 11',        set: 'Image · Planeta',    meta: 'TPB · 152pp',              tag: 'Nuevo' },
  { id: 'c2', name: 'Daredevil: Born Again',    set: 'Marvel',             meta: 'Marvel Premiere',          tag: 'Clásico' },
  { id: 'c3', name: 'Sandman · Tomo I',         set: 'ECC',                meta: 'Edición Deluxe',           tag: 'Deluxe' },
  { id: 'c4', name: 'The Boys · Omnibus 3',     set: 'Norma',              meta: 'Omnibus · 480pp',          tag: 'Omnibus' },
  { id: 'c5', name: 'Watchmen · Vol. 1',        set: 'ECC',                meta: 'Edición coleccionista',    tag: 'Clásico' },
  { id: 'c6', name: 'Paper Girls · Integral',   set: 'Planeta',            meta: 'Tomo único · 800pp',       tag: 'Integral' },
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
  address: ['C. de Butarque, 14, Puerta B LOCAL 3, 28911 Leganés, Madrid'],
  hours: [
    ['Lunes – Viernes', '17:00 – 21:00'],
    ['Sábado',          '11:00 – 21:00'],
    ['Domingo',         '11:00 – 15:00'],
  ],
  phone: '+34 600 12 34 56',
  email: 'hola@daruma.shop',
  socials: ['@daruma.shop', '@darumastore'],
};
