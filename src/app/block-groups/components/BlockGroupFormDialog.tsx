import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { FormInput } from "@/components/FieldCustom/FormInput"
import { FormSelect } from "@/components/FieldCustom/FormSelect"
import { FormDialog } from "@/components/UiCustom/FormDialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { MODAL_MODE, type ModalModeType } from "@/constants/common"

import { BLOCK_GROUP_TYPE_OPTIONS, getBlockTypeLabel } from "../constants/block-type"
import {
  createBlockGroupDefaultValues,
  createBlockGroupSchema,
  updateBlockGroupDefaultValues,
  updateBlockGroupSchema,
  type CreateBlockGroupFormInput,
  type CreateBlockGroupFormValues,
  type UpdateBlockGroupFormInput,
  type UpdateBlockGroupFormValues,
} from "../schemas/block-group-form.schema"
import type { BlockGroup } from "../types/block-group"

interface BlockGroupFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: ModalModeType
  blockGroup?: BlockGroup | null
  loading?: boolean
  onCreate: (values: CreateBlockGroupFormValues) => void
  onUpdate: (values: UpdateBlockGroupFormValues) => void
}

export function BlockGroupFormDialog({
  open,
  onOpenChange,
  mode,
  blockGroup,
  loading,
  onCreate,
  onUpdate,
}: BlockGroupFormDialogProps) {
  const isEdit = mode === MODAL_MODE.EDIT

  const createForm = useForm<
    CreateBlockGroupFormInput,
    unknown,
    CreateBlockGroupFormValues
  >({
    resolver: zodResolver(createBlockGroupSchema),
    defaultValues: createBlockGroupDefaultValues,
  })

  const updateForm = useForm<
    UpdateBlockGroupFormInput,
    unknown,
    UpdateBlockGroupFormValues
  >({
    resolver: zodResolver(updateBlockGroupSchema),
    defaultValues: updateBlockGroupDefaultValues,
  })

  useEffect(() => {
    if (!open) return

    if (isEdit && blockGroup) {
      updateForm.reset({
        name: blockGroup.name,
        weight: blockGroup.weight,
        sortOrder: blockGroup.sortOrder,
        pickCount: blockGroup.pickCount,
        isActive: blockGroup.isActive,
      })
      return
    }

    createForm.reset(createBlockGroupDefaultValues)
  }, [open, isEdit, blockGroup, createForm, updateForm])

  const formId = isEdit ? "block-group-edit-form" : "block-group-create-form"
  const title = isEdit ? "Sửa nhóm CTA" : "Thêm nhóm CTA"
  const description = isEdit
    ? "Loại và mã nhóm không thể thay đổi sau khi tạo."
    : "Nhóm của nội dung kêu gọi hành động (Tương tác, Chốt đơn, Social proof...)."

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button type="submit" form={formId} disabled={loading}>
            {loading ? "Đang xử lý..." : "Lưu"}
          </Button>
        </>
      }
    >
      {isEdit ? (
        <Form {...updateForm}>
          <form
            id={formId}
            className="space-y-4"
            onSubmit={updateForm.handleSubmit(onUpdate)}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium">Loại block</p>
                <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
                  {blockGroup ? getBlockTypeLabel(blockGroup.type) : "—"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Mã</p>
                <p className="rounded-md border bg-muted/40 px-3 py-2 font-mono text-sm">
                  {blockGroup?.code}
                </p>
              </div>
            </div>
            <FormInput
              control={updateForm.control}
              name="name"
              label="Tên nhóm"
              placeholder="Tương tác, Chốt đơn..."
              required
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <FormInput
                control={updateForm.control}
                name="weight"
                label="Trọng số"
                type="number"
                required
              />
              <FormInput
                control={updateForm.control}
                name="sortOrder"
                label="Thứ tự"
                type="number"
                required
              />
              <FormInput
                control={updateForm.control}
                name="pickCount"
                label="Số lượng chọn"
                type="number"
                required
              />
            </div>
            <FormField
              control={updateForm.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-md border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Đang hoạt động</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Nhóm ngưng hoạt động sẽ không được chọn khi random kịch
                      bản.
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      ) : (
        <Form {...createForm}>
          <form
            id={formId}
            className="space-y-4"
            onSubmit={createForm.handleSubmit(onCreate)}
          >
            <FormSelect
              control={createForm.control}
              name="type"
              label="Loại block"
              placeholder="Chọn loại block"
              options={BLOCK_GROUP_TYPE_OPTIONS}
              required
            />
            <FormInput
              control={createForm.control}
              name="code"
              label="Mã nhóm"
              placeholder="TUONG_TAC, CHOT_DON..."
              required
            />
            <FormInput
              control={createForm.control}
              name="name"
              label="Tên nhóm"
              placeholder="Tương tác, Chốt đơn..."
              required
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <FormInput
                control={createForm.control}
                name="weight"
                label="Trọng số"
                type="number"
                required
              />
              <FormInput
                control={createForm.control}
                name="sortOrder"
                label="Thứ tự"
                type="number"
                required
              />
              <FormInput
                control={createForm.control}
                name="pickCount"
                label="Số lượng chọn"
                type="number"
                required
              />
            </div>
            <FormField
              control={createForm.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-md border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Đang hoạt động</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Nhóm ngưng hoạt động sẽ không được chọn khi random kịch
                      bản.
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
    </FormDialog>
  )
}
