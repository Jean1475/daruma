import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getProduct } from '@/app/lib/data-service'
import { ProductForm } from '@/app/(dashboard)/components/product-form'
import { updateProduct } from '../../actions'

export default async function EditProductPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const product = await getProduct(id)

  if (!product) notFound()

  const action = updateProduct.bind(null, id)

  return (
    <div>
      <div className="mb-6">
        <h1
          className="text-2xl font-bold tracking-tight text-[var(--color-daruma-ink)]"
          style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
        >
          Editar producto
        </h1>
        <p className="mt-1 text-sm text-[var(--color-daruma-ink)]/50">
          {product.name}
        </p>
      </div>

      <Suspense>
        <ProductForm product={product} action={action} />
      </Suspense>
    </div>
  )
}
