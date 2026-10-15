import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getApiErrorMessage } from "@/lib/get-api-error-message"

import { productKeys } from "../queries/product-query"
import {
  createProduct,
  deleteProduct,
  runSapoSync,
  updateProduct,
  uploadProductImage,
} from "../services/productService"
import type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from "../types/product"

interface CreateProductInput {
  payload: CreateProductPayload
  imageFile?: File | null
}

interface UpdateProductInput {
  id: string
  payload: UpdateProductPayload
  imageFile?: File | null
  existingProduct?: Product | null
}

async function resolveImages(
  imageFile: File | null | undefined,
  existingProduct?: Product | null
): Promise<string[] | undefined> {
  if (!imageFile) return undefined

  const uploaded = await uploadProductImage(imageFile)
  const rest = existingProduct?.images.slice(1) ?? []
  return [uploaded.imageUrl, ...rest]
}

export function useProductMutations() {
  const queryClient = useQueryClient()

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: productKeys.all })

  const createMutation = useMutation({
    mutationFn: async ({ payload, imageFile }: CreateProductInput) => {
      const images = imageFile
        ? [(await uploadProductImage(imageFile)).imageUrl]
        : undefined

      return createProduct({
        ...payload,
        ...(images ? { images } : {}),
      })
    },
    onSuccess: async () => {
      await invalidate()
      toast.success("Tạo sản phẩm thành công")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể tạo sản phẩm"))
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload, imageFile, existingProduct }: UpdateProductInput) => {
      const images = await resolveImages(imageFile, existingProduct)

      return updateProduct(id, {
        ...payload,
        ...(images ? { images } : {}),
      })
    },
    onSuccess: async () => {
      await invalidate()
      toast.success("Cập nhật sản phẩm thành công")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể cập nhật sản phẩm"))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: async () => {
      await invalidate()
      toast.success("Xóa sản phẩm thành công")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể xóa sản phẩm"))
    },
  })

  const sapoSyncMutation = useMutation({
    mutationFn: async () => {
      const status = await runSapoSync()
      if (status.error) throw new Error(status.error)
      return status.result
    },
    onSuccess: async (result) => {
      await invalidate()
      toast.success(
        `Đồng bộ Sapo xong: ${result?.created ?? 0} SP mới, ${result?.updated ?? 0} SP cập nhật, ${result?.deactivated ?? 0} SP ngưng bán`
      )
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, error.message || "Không đồng bộ được Sapo")
      )
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    sapoSyncMutation,
  }
}
