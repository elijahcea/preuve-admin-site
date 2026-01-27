import type { Collection, CollectionPreview, Product, ProductPreview } from '@/lib/types'

export async function fetchProducts(): Promise<ProductPreview[]> {
  const response = await fetch(import.meta.env.VITE_PRODUCTS_API_URL)
  if (!response.ok) throw new Error('Network response was not ok')

  return response.json()
}

export async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`${import.meta.env.VITE_PRODUCTS_API_URL}/${id}`)
  if (!response.ok) throw new Error('Network response was not ok')

  return response.json()
}

export async function fetchCollections(): Promise<CollectionPreview[]> {
  const response = await fetch(import.meta.env.VITE_COLLECTIONS_API_URL)
  if (!response.ok) throw new Error('Network response was not ok')

  return response.json()
}

export async function fetchCollection(slug: string): Promise<Collection> {
  const response = await fetch(`${import.meta.env.VITE_COLLECTIONS_API_URL}/${slug}`)
  if (!response.ok) throw new Error('Network response was not ok')

  return response.json()
}
