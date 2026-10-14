import { queryOptions } from "@tanstack/react-query"

import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/types/pagination"

import {
  fetchProduct,
  fetchProducts,
  fetchProductTypes,
} from "../services/productService"
import type { ListProductsParams } from "../types/product"

export const productKeys = {
  all: ["products"] as const,
  list: (params: ListProductsParams) => [...productKeys.all, "list", params] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
  types: () => [...productKeys.all, "types"] as const,
}

export function listProductsQueryOptions(params: ListProductsParams = {}) {
  const normalized = {
    ...params,
    page: params.page ?? DEFAULT_PAGE,
    limit: params.limit ?? DEFAULT_LIMIT,
    q: params.q?.trim() || undefined,
  }

  return queryOptions({
    queryKey: productKeys.list(normalized),
    queryFn: () => fetchProducts(normalized),
    staleTime: 30_000,
  })
}

export function productTypesQueryOptions() {
  return queryOptions({
    queryKey: productKeys.types(),
    queryFn: fetchProductTypes,
    staleTime: 5 * 60_000,
  })
}

export function productDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProduct(id),
    staleTime: 60_000,
  })
}
