export interface ProductVariant {
  id: string
  sku: string
  name: string | null
  price: string | null
  stock: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  code: string
  name: string
  categoryId: string | null
  categoryName: string | null
  attributes: Record<string, unknown> | null
  description: string | null
  images: string[]
  videoUrl: string | null
  sapoId: string | null
  sapoUrl: string | null
  productType: string | null
  isActive: boolean
  variants: ProductVariant[]
  createdAt: string
  updatedAt: string
}

export interface ProductVariantPayload {
  sku: string
  name?: string
  price?: number
  stock?: number
  isActive?: boolean
}

export interface CreateProductPayload {
  code: string
  name: string
  description?: string
  images?: string[]
  isActive?: boolean
  variants?: ProductVariantPayload[]
}

export interface UpdateProductPayload {
  name?: string
  description?: string
  images?: string[]
  isActive?: boolean
  variants?: ProductVariantPayload[]
}

export interface ListProductsParams {
  page?: number
  limit?: number
  q?: string
  categoryId?: string
  isActive?: boolean
  productType?: string
  minPrice?: number
  maxPrice?: number
}

export interface ProductImageUploadResponse {
  imageUrl: string
}
