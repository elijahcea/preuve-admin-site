import type { CreateProductResponse, ProductCreateDTO } from '@/lib/types'
import axios from 'axios'

export async function postNewProduct(newProduct: ProductCreateDTO): Promise<CreateProductResponse> {
  const response = await axios.post(`${import.meta.env.VITE_PRODUCTS_API_URL}`, newProduct)
  return response.data
}

export async function deleteProduct(productId: string) {
  const response = await axios.delete(`${import.meta.env.VITE_PRODUCTS_API_URL}/${productId}`)
  return response.data
}

export async function deleteCollection(collectionId: string) {
  const response = await axios.delete(`${import.meta.env.VITE_COLLECTIONS_API_URL}/${collectionId}`)
  return response.data
}
