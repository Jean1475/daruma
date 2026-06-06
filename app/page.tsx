import { Landing } from '@/app/components/landing';
import { getProducts, getEvents, getSiteConfig } from './lib/data-service';
import { VISIT } from './data';

export default async function Home() {
  const [products, events, siteConfig] = await Promise.all([
    getProducts(),
    getEvents(),
    getSiteConfig(),
  ]);

  const landingEvents = events.map((ev) => ({
    id: ev.id,
    date: { d: ev.date_day, m: ev.date_month, dow: ev.date_dow },
    when: ev.time,
    title: ev.title,
    desc: ev.description,
    price: ev.price,
    badge: ev.badge,
  }));

  return (
    <main>
      <Landing
        products={products}
        events={landingEvents}
        storeInfo={VISIT}
        heroSlides={siteConfig.heroSlides}
        stripeItems={siteConfig.stripeItems}
        logoCarousel={siteConfig.logoCarousel}
      />
    </main>
  );
}
