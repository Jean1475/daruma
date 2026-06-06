import { getProducts } from '@/app/lib/data-service';
import { BLOG_POSTS } from '@/app/blog/data';
import { BuscarClient } from './buscar-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buscar · Pokétienda',
};

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; tag?: string }>;
}) {
  const { q, cat, tag } = await searchParams;
  const query = (q ?? '').trim().toLowerCase();
  const initialTags = tag ? tag.split(',').map((t) => t.trim()).filter(Boolean) : [];

  const allProducts = await getProducts();

  const products = query
    ? allProducts.filter((p) =>
        (p.name + ' ' + p.set + ' ' + p.meta + ' ' + p.cat + ' ' + (p.tags ?? []).join(' '))
          .toLowerCase()
          .includes(query)
      )
    : cat && cat !== 'all'
      ? allProducts
      : initialTags.length > 0
        ? allProducts
        : [];

  const blogPosts = query
    ? BLOG_POSTS.filter((p) =>
        (p.title + ' ' + p.excerpt + ' ' + p.tags.join(' ') + ' ' + p.category)
          .toLowerCase()
          .includes(query)
      )
    : [];

  return (
    <BuscarClient
      query={q ?? ''}
      initialCat={cat ?? 'all'}
      initialTags={initialTags}
      products={products}
      blogPosts={blogPosts}
    />
  );
}
