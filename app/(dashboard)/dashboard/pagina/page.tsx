import { getSiteConfig } from '@/app/lib/data-service'
import { PaginaClient } from './pagina-client'
import { updateStripeItems, updateHeroSlides, updateLogoCarousel } from './actions'

export default async function PaginaPage() {
  const { stripeItems, heroSlides, logoCarousel } = await getSiteConfig()

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-bold tracking-tight text-[var(--color-daruma-ink)]"
          style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
        >
          Página web
        </h1>
        <p className="mt-1 text-sm text-[var(--color-daruma-ink)]/50">
          Edita las secciones visibles en la landing.
        </p>
      </div>

      <PaginaClient
        initialStripeItems={stripeItems}
        initialHeroSlides={heroSlides}
        initialLogoCarousel={logoCarousel}
        stripeAction={updateStripeItems}
        slidesAction={updateHeroSlides}
        logoAction={updateLogoCarousel}
      />
    </div>
  )
}
