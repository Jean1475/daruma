import { getProduct, getProducts } from '@/app/lib/data-service';
import { notFound } from 'next/navigation';
import { ProductoDetail } from './producto-detail';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: 'Producto no encontrado · Pokétienda' };
  return {
    title: `${product.name} · Pokétienda`,
    description: `${product.meta} — ${product.set}. Disponible en Pokétienda, Leganés.`,
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, allProducts] = await Promise.all([getProduct(id), getProducts()]);

  if (!product) notFound();

  const related = allProducts
    .filter((p) => p.id !== id && p.cat === product.cat)
    .slice(0, 5);

  return <ProductoDetail product={product} related={related} />;
}
