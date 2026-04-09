import type {
  CollectionCreateDTO,
  CollectionUpdateDTO,
  CreateProductResponse,
  GenerateSignatureDTO,
  OptionCreateDTO,
  OptionUpdateDTO,
  ProductCreateDTO,
  ProductUpdateDTO,
  ProductVariantCreateDTO,
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

export async function createCollection(token: string, newCollection: CollectionCreateDTO) {
  const response = await axios.post(`${import.meta.env.VITE_COLLECTIONS_API_URL}`, newCollection, {
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

export async function deleteOption(token: string, productId: string, optionId: string) {
  const response = await axios.delete(
    `${import.meta.env.VITE_PRODUCTS_API_URL}/${productId}/options/${optionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}

export async function deleteVariant(token: string, productId: string, variantId: string) {
  const response = await axios.delete(
    `${import.meta.env.VITE_PRODUCTS_API_URL}/${productId}/variants/${variantId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}

export async function updateCollection(
  token: string,
  collectionId: string,
  updatedCollection: CollectionUpdateDTO,
) {
  const response = await axios.put(
    `${import.meta.env.VITE_COLLECTIONS_API_URL}/${collectionId}`,
    updatedCollection,
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
    `${import.meta.env.VITE_PRODUCTS_API_URL}/${productId}/variants/${variantId}`,
    updatedVariant,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}

export async function createOption(token: string, productId: string, option: OptionCreateDTO) {
  const response = await axios.post(
    `${import.meta.env.VITE_PRODUCTS_API_URL}/${productId}/options`,
    option,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}

export async function createVariant(
  token: string,
  productId: string,
  variant: ProductVariantCreateDTO,
) {
  const response = await axios.post(
    `${import.meta.env.VITE_PRODUCTS_API_URL}/${productId}/variants`,
    variant,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}

export async function generateCloudinarySignature(token: string, input: GenerateSignatureDTO) {
  const response = await fetch(`${import.meta.env.VITE_IMAGES_API_URL}`, {
    method: 'POST',
    body: JSON.stringify(input),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) throw new Error('Failed to generate signature')

  return response.json()
}

export async function uploadImageToCloudinary(formData: FormData) {
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME = 'dedr8n2bj')}/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  )
  if (!response.ok) throw new Error('Failed to upload image to Cloudinary')

  return response.json()
}
