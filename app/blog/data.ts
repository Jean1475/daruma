export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  dateIso: string;
  category: string;
  categoryJp: string;
  readTime: string;
  excerpt: string;
  body: string; // HTML string
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'chaos-rising-mejores-cartas',
    title: 'Chaos Rising: las cartas que deberías tener en el radar',
    subtitle: '新セット分析',
    date: '28 mayo 2026',
    dateIso: '2026-05-28',
    category: 'Análisis de set',
    categoryJp: 'セット分析',
    readTime: '6 min',
    excerpt: 'El nuevo set de Pokémon TCG llegó con más sorpresas de las esperadas. Repasamos las cartas más interesantes tanto para jugar como para coleccionar.',
    tags: ['Pokémon TCG', 'Chaos Rising', 'análisis', 'chase cards'],
    body: `
      <p>Chaos Rising llegó a tienda hace dos semanas y ya hemos podido ver de primera mano qué cartas tienen más tracción. Como de costumbre, hay un puñado de chase cards que concentran la atención, y luego un segundo nivel de cartas competitivas que a veces pasan desapercibidas.</p>
      <h2>Las chase cards del set</h2>
      <p>La Illustration Rare de este set es, sin duda, la que más nos han pedido. La calidad de ilustración marca un nivel que no habíamos visto desde 151. Si coleccionas SIR e IR, este set no te lo puedes saltar.</p>
      <p>El nuevo Charizard ex Special Illustration tiene exactamente la energía correcta — oscuro, dinámico, con fondo trabajado. En menos de una semana de apertura ya hemos visto tres en tienda y han salido volando.</p>
      <h2>Para el competitivo</h2>
      <p>Más allá del pull rate, hay dos o tres cartas que ya están apareciendo en listas de torneo. La primera es el nuevo Trainer que resetea energías — en el formato actual rompe líneas de juego que parecían inamovibles. La segunda es un Pokémon de tipo Fuego que combina bien con la engine de descarte que lleva meses siendo dominante.</p>
      <h2>¿Vale la pena abrir sobres?</h2>
      <p>Como siempre: si lo que buscas son las cartas específicas, comprar singles sale más a cuenta que abrir sobres salvo que el proceso de apertura sea parte de la experiencia para ti. Si quieres la experiencia, los boosters de Chaos Rising son sólidos — la distribución de rarezas nos ha parecido más generosa que en sets anteriores del mismo ciclo.</p>
      <p>Tenemos stock disponible en tienda. Si buscas una carta concreta, pregúntanos — puede que la tengamos en el cajón antes de que llegue al escaparate.</p>
    `,
  },
  {
    slug: 'guia-torneos-pokemon-principiantes',
    title: 'Tu primera liga Pokémon: lo que nadie te explica',
    subtitle: '初心者ガイド',
    date: '14 mayo 2026',
    dateIso: '2026-05-14',
    category: 'Guía',
    categoryJp: 'ガイド',
    readTime: '8 min',
    excerpt: 'Ir a tu primer torneo da un poco de respeto. Con este artículo vas a saber exactamente qué esperar, qué llevar y cómo no quedarte fuera de juego antes de empezar.',
    tags: ['torneos', 'principiantes', 'liga', 'Pokémon TCG'],
    body: `
      <p>Mucha gente nos pregunta cómo funciona la liga antes de venir por primera vez. La respuesta corta: es mucho más relajada de lo que parece. La respuesta larga es este artículo.</p>
      <h2>Qué es la liga semanal</h2>
      <p>Cada sábado a las 17:00 organizamos la liga en formato estándar. Formato estándar significa que solo se pueden usar cartas de los últimos dos o tres años — los sets rotados salen del juego. Si no sabes si tu mazo es legal, tráelo y lo miramos juntos antes de empezar.</p>
      <h2>Qué llevar</h2>
      <p>Tu mazo de 60 cartas, dados, contadores de daño (monedas, contadores de piedra, lo que uses habitualmente) y la lista de mazo. La lista de mazo es una hoja o documento con el nombre y la cantidad de cada carta. No hace falta que sea perfecta para la liga semanal, pero es buena costumbre tenerla.</p>
      <p>Los sleeves no son obligatorios pero están muy bien vistos. Cualquier sleeve opaco del mismo modelo vale.</p>
      <h2>Cómo funciona la ronda</h2>
      <p>Jugamos rondas suizas de 30 minutos. Al final de las rondas, los mejores resultados pasan a top cut si hay suficiente gente. En nuestra liga solemos ser entre 8 y 20 jugadores, así que el ambiente es compacto y conoces a todo el mundo rápido.</p>
      <h2>¿Tengo que saber el meta?</h2>
      <p>No. Para la liga local, lo más importante es conocer tu propio mazo. Es mejor jugar bien un mazo que no es tier 1 que jugar mal el mejor mazo del formato. Dicho esto, si quieres aprender el meta, pregunta — en tienda podemos explicarte qué está jugando la gente y por qué.</p>
      <h2>El ambiente</h2>
      <p>La liga es la misma gente todas las semanas, más caras nuevas cada cierto tiempo. Los jugadores veteranos suelen estar dispuestos a explicar jugadas y a hacer partidas de práctica. Si es tu primera vez y lo dices, la gente se porta bien.</p>
      <p>Nos vemos el sábado.</p>
    `,
  },
  {
    slug: 'manga-mas-buscados-mayo-2026',
    title: 'Los 8 mangas más pedidos en tienda este mes',
    subtitle: '月間ランキング',
    date: '1 mayo 2026',
    dateIso: '2026-05-01',
    category: 'Ranking',
    categoryJp: 'ランキング',
    readTime: '4 min',
    excerpt: 'Un mes más, los mismos títulos en el top y alguna sorpresa. El ranking de lo que más nos piden en tienda, con notas de cada uno.',
    tags: ['manga', 'ranking', 'novedades', 'recomendaciones'],
    body: `
      <p>Llevamos un registro de lo que la gente nos pregunta en tienda aunque no esté en stock. Estos son los ocho títulos del mes de mayo que más veces hemos escuchado.</p>
      <h2>1. Berserk — Kentaro Miura / Studio Gaga</h2>
      <p>Sigue siendo la referencia. Especialmente los tomos del 1 al 15, que son los más difíciles de encontrar en buenas condiciones. Lo tenemos en stock rotatorio — si necesitas alguno específico, pregunta.</p>
      <h2>2. Chainsaw Man, segunda parte</h2>
      <p>La segunda parte de Fujimoto tiene un ritmo diferente al de la primera pero mantiene exactamente el mismo nivel de locura controlada. Los tres primeros tomos de la segunda parte se piden muchísimo.</p>
      <h2>3. Dungeon Meshi</h2>
      <p>Con la adaptación de anime todavía fresca, la gente quiere la fuente original. Tenemos colección completa disponible.</p>
      <h2>4. Oyasumi Punpun</h2>
      <p>De los títulos más pedidos que tenemos en stock permanente. Si no lo has leído, es de los que se quedan contigo.</p>
      <h2>5. Blue Period</h2>
      <p>El manga sobre arte y preparación universitaria que parece que no puede gustar tanto y resulta que engancha a todo el mundo.</p>
      <h2>6. Frieren</h2>
      <p>El ritmo lento como decisión estética. Uno de los mangas que mejor ha envejecido de los últimos años en catálogo.</p>
      <h2>7. Vagabond</h2>
      <p>Inoue en estado puro. Difícil de encontrar en buenas condiciones. Cuando entra stock sale rápido.</p>
      <h2>8. Junji Ito — cualquier cosa</h2>
      <p>Gyo, Uzumaki, La Balada de un Ser Humano... No importa el título. Siempre hay alguien buscando algo de Junji Ito. Tenemos varios disponibles.</p>
      <p>¿Buscas algo que no está en esta lista? Pregúntanos. Si no lo tenemos, intentamos conseguirlo.</p>
    `,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
