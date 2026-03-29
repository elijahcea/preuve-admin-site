import type {
  CreateProductResponse,
  OptionUpdateDTO,
  ProductCreateDTO,
  ProductUpdateDTO,
  ProductVariantUpdateDTO,
} from '@/lib/types'
import axios from 'axios'

export async function postNewProduct(
  token: string,
  newProduct: ProductCreateDTO,
): Promise<CreateProductResponse> {
  const response = await axios.post(`${import.meta.env.VITE_PRODUCTS_API_URL}`, newProduct, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function deleteProduct(token: string, productId: string) {
  const response = await axios.delete(`${import.meta.env.VITE_PRODUCTS_API_URL}/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function deleteCollection(token: string, collectionId: string) {
  const response = await axios.delete(
    `${import.meta.env.VITE_COLLECTIONS_API_URL}/${collectionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}

export async function updateProduct(
  token: string,
  productId: string,
  updatedProduct: ProductUpdateDTO,
) {
  const response = await axios.put(
    `${import.meta.env.VITE_PRODUCTS_API_URL}/${productId}`,
    updatedProduct,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}

export async function updateOption(
  token: string,
  productId: string,
  optionId: string,
  updatedOption: OptionUpdateDTO,
) {
  const response = await axios.put(
    `${import.meta.env.VITE_PRODUCTS_API_URL}/${productId}/options/${optionId}`,
    updatedOption,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}

export async function updateVariant(
  token: string,
  productId: string,
  variantId: string,
  updatedVariant: ProductVariantUpdateDTO,
) {
  const response = await axios.put(
    `${import.meta.env.VITE_PRODUCTS_API_URL}/${productId}/options/${variantId}`,
    updatedVariant,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}
