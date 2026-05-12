import { Landing } from '@/app/components/landing';
import { ALL_STOCK, EVENTS, VISIT } from './data';

export default function Home() {
  return (
    <main>
      <Landing
        products={ALL_STOCK}
        events={EVENTS}
        storeInfo={VISIT}
      />
    </main>
  );
}
