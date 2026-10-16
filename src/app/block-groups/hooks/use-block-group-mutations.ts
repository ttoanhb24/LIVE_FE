import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getApiErrorMessage } from "@/lib/get-api-error-message"

import { blockGroupKeys } from "../queries/block-group-query"
import {
  createBlockGroup,
  deleteBlockGroup,
  updateBlockGroup,
} from "../services/blockGroupService"
import type {
  CreateBlockGroupPayload,
  UpdateBlockGroupPayload,
} from "../types/block-group"

export function useBlockGroupMutations() {
  const queryClient = useQueryClient()

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: blockGroupKeys.all })

  const createMutation = useMutation({
    mutationFn: (payload: CreateBlockGroupPayload) => createBlockGroup(payload),
    onSuccess: async () => {
      await invalidate()
      toast.success("Tạo nhóm CTA thành công")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể tạo nhóm CTA"))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateBlockGroupPayload
    }) => updateBlockGroup(id, payload),
    onSuccess: async () => {
      await invalidate()
      toast.success("Cập nhật nhóm CTA thành công")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể cập nhật nhóm CTA"))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBlockGroup(id),
    onSuccess: async () => {
      await invalidate()
      toast.success("Xóa nhóm CTA thành công")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể xóa nhóm CTA"))
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
