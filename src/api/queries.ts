import type {
  GetProductsResponse,
  GetProductResponse,
  GetCollectionsResponse,
  GetCollectionResponse,
} from '@/lib/types'

export async function fetchProducts(): Promise<GetProductsResponse> {
  const response = await fetch(import.meta.env.VITE_PRODUCTS_API_URL)
  if (!response.ok) throw new Error('Network response was not ok')

  return response.json()
}

export async function fetchProduct(id: string): Promise<GetProductResponse> {
  const response = await fetch(`${import.meta.env.VITE_PRODUCTS_API_URL}/${id}`)
  if (!response.ok) throw new Error('Network response was not ok')

  return response.json()
}

export async function fetchCollections(): Promise<GetCollectionsResponse> {
  const response = await fetch(import.meta.env.VITE_COLLECTIONS_API_URL)
  if (!response.ok) throw new Error('Network response was not ok')

  return response.json()
}

export async function fetchCollection(slug: string): Promise<GetCollectionResponse> {
  const response = await fetch(`${import.meta.env.VITE_COLLECTIONS_API_URL}/${slug}`)
  if (!response.ok) throw new Error('Network response was not ok')

  return response.json()
}
