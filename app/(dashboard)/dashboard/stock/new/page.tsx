import { Suspense } from 'react'
import { ProductForm } from '@/app/(dashboard)/components/product-form'
import { createProduct } from '../actions'

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-6">
        <h1
          className="text-2xl font-bold tracking-tight text-[var(--color-daruma-ink)]"
          style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
        >
          Nuevo producto
        </h1>
        <p className="mt-1 text-sm text-[var(--color-daruma-ink)]/50">
          Añadir una carta, manga o comic al stock.
        </p>
      </div>

      <Suspense>
        <ProductForm action={createProduct} />
      </Suspense>
    </div>
  )
}
