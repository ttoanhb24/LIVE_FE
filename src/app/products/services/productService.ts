import API_PATHS from "@/constants/apiPaths"
import httpService from "@/services/httpService"
import type { PaginatedResponse } from "@/types/pagination"

import type {
  CreateProductPayload,
  ListProductsParams,
  Product,
  ProductImageUploadResponse,
  UpdateProductPayload,
} from "../types/product"

export async function fetchProducts(
  params: ListProductsParams
): Promise<PaginatedResponse<Product>> {
  const { data } = await httpService.get<PaginatedResponse<Product>>(
    API_PATHS.PRODUCTS.BASE,
    { params }
  )
  return data
}

export async function fetchProductTypes(): Promise<string[]> {
  const { data } = await httpService.get<string[]>(API_PATHS.PRODUCTS.TYPES)
  return data
}

export async function fetchProduct(id: string): Promise<Product> {
  const { data } = await httpService.get<Product>(API_PATHS.PRODUCTS.BY_ID(id))
  return data
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const { data } = await httpService.post<Product>(API_PATHS.PRODUCTS.BASE, payload)
  return data
}

export async function updateProduct(
  id: string,
  payload: UpdateProductPayload
): Promise<Product> {
  const { data } = await httpService.patch<Product>(
    API_PATHS.PRODUCTS.BY_ID(id),
    payload
  )
  return data
}

export async function deleteProduct(id: string): Promise<void> {
  await httpService.delete(API_PATHS.PRODUCTS.BY_ID(id))
}

export async function uploadProductImage(
  file: File
): Promise<ProductImageUploadResponse> {
  const formData = new FormData()
  formData.append("image", file)

  const { data } = await httpService.post<ProductImageUploadResponse>(
    API_PATHS.PRODUCTS.UPLOAD_IMAGE,
    formData
  )
  return data
}
