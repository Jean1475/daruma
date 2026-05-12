import { createClient } from '@supabase/supabase-js';
import { ALL_STOCK, EVENTS, VISIT } from '../../app/data';
import { Database } from '../../types/supabase';

// This script is meant to be run locally to populate your Supabase database.
// You need to set these environment variables or replace them with your actual values.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = createClient<Database>(supabaseUrl, supabaseKey) as any;

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Seed Store Info
  console.log('  - Seeding store info...');
  const { error: infoError } = await supabase
    .from('store_info')
    .upsert([{
      id: 1,
      address: VISIT.address,
      hours: VISIT.hours as any,
      phone: VISIT.phone,
      email: VISIT.email,
      socials: VISIT.socials,
    }] as any);

  if (infoError) console.error('Error seeding store info:', infoError.message);

  // 2. Seed Products
  console.log('  - Seeding products...');
  const formattedProducts = ALL_STOCK.map(p => ({
    name: p.name,
    category: p.cat as 'pokemon' | 'manga' | 'comics',
    set_name: p.set,
    meta: (p as any).meta || '',
    tag: p.tag,
    featured: p.tag === 'Chase',
    available: true,
  }));

  const { error: productsError } = await supabase
    .from('products')
    .insert(formattedProducts);

  if (productsError) console.error('Error seeding products:', productsError.message);

  // 3. Seed Events
  console.log('  - Seeding events...');
  const formattedEvents = EVENTS.map(e => {
    // Map the mockup date to a real date string
    // e.g., "16 MAY" -> 2026-05-16
    const monthMap: Record<string, string> = { 'MAY': '05', 'JUN': '06' };
    const month = monthMap[e.date.m] || '05';
    const startsAt = `2026-${month}-${e.date.d}T${e.when}:00Z`;

    return {
      title: e.title,
      description: e.desc,
      starts_at: startsAt,
      badge: e.badge,
      price_text: e.price,
    };
  });

  const { error: eventsError } = await supabase
    .from('events')
    .insert(formattedEvents);

  if (eventsError) console.error('Error seeding events:', eventsError.message);

  console.log('✅ Seeding complete!');
}

seed();
