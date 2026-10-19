import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { FormInput } from "@/components/FieldCustom/FormInput"
import { FormTextarea } from "@/components/FieldCustom/FormTextarea"
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

import {
  createProductDefaultValues,
  createProductSchema,
  mapProductVariantsToForm,
  updateProductDefaultValues,
  updateProductSchema,
  type CreateProductFormInput,
  type CreateProductFormValues,
  type UpdateProductFormInput,
  type UpdateProductFormValues,
} from "../schemas/product-form.schema"
import type { Product } from "../types/product"
import { ProductImageUpload } from "./ProductImageUpload"
import { ProductVariantsFields } from "./ProductVariantsFields"

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: ModalModeType
  product?: Product | null
  loading?: boolean
  onCreate: (values: CreateProductFormValues, imageFile: File | null) => void
  onUpdate: (values: UpdateProductFormValues, imageFile: File | null) => void
}

export function ProductFormDialog({
  open,
  onOpenChange,
  mode,
  product,
  loading,
  onCreate,
  onUpdate,
}: ProductFormDialogProps) {
  const isEdit = mode === MODAL_MODE.EDIT
  const [imageFile, setImageFile] = useState<File | null>(null)

  const createForm = useForm<
    CreateProductFormInput,
    unknown,
    CreateProductFormValues
  >({
    resolver: zodResolver(createProductSchema),
    defaultValues: createProductDefaultValues,
  })

  const updateForm = useForm<
    UpdateProductFormInput,
    unknown,
    UpdateProductFormValues
  >({
    resolver: zodResolver(updateProductSchema),
    defaultValues: updateProductDefaultValues,
  })

  useEffect(() => {
    if (!open) return

    setTimeout(() => {
      setImageFile(null)
    }, 0)

    if (isEdit && product) {
      updateForm.reset({
        name: product.name,
        description: product.description ?? "",
        isActive: product.isActive,
        variants: mapProductVariantsToForm(product.variants),
      })
      return
    }

    createForm.reset(createProductDefaultValues)
  }, [open, isEdit, product, createForm, updateForm])

  const formId = isEdit ? "product-edit-form" : "product-create-form"
  const title = isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm"
  const description = isEdit
    ? "Mã sản phẩm không thể thay đổi sau khi tạo."
    : "Tạo sản phẩm thủ công."

  const imageUploadKey = `${mode}-${product?.id ?? "new"}-${String(open)}`

  function handleCreateSubmit(values: CreateProductFormValues) {
    onCreate(values, imageFile)
  }

  function handleUpdateSubmit(values: UpdateProductFormValues) {
    onUpdate(values, imageFile)
  }

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
            onSubmit={updateForm.handleSubmit(handleUpdateSubmit)}
          >
            <div className="space-y-2">
              <p className="text-sm font-medium">Mã sản phẩm</p>
              <p className="rounded-md border bg-muted/40 px-3 py-2 font-mono text-sm">
                {product?.code}
              </p>
            </div>
            <FormInput
              control={updateForm.control}
              name="name"
              label="Tên sản phẩm"
              placeholder="Nhẫn vàng 18K..."
              required
            />
            <FormTextarea
              control={updateForm.control}
              name="description"
              label="Mô tả"
              placeholder="Mô tả ngắn về sản phẩm"
              rows={3}
            />
            <ProductImageUpload
              key={imageUploadKey}
              existingImageUrl={product?.images[0]}
              disabled={loading}
              onFileChange={setImageFile}
            />
            <ProductVariantsFields form={updateForm} disabled={loading} />
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
                    <FormLabel>Đang bán</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Sản phẩm ngưng bán sẽ không xuất hiện khi chọn cho kịch
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
            onSubmit={createForm.handleSubmit(handleCreateSubmit)}
          >
            <FormInput
              control={createForm.control}
              name="code"
              label="Mã sản phẩm"
              placeholder="SP001, NHAN-VANG-01..."
              required
            />
            <FormInput
              control={createForm.control}
              name="name"
              label="Tên sản phẩm"
              placeholder="Nhẫn vàng 18K..."
              required
            />
            <FormTextarea
              control={createForm.control}
              name="description"
              label="Mô tả"
              placeholder="Mô tả ngắn về sản phẩm"
              rows={3}
            />
            <ProductImageUpload
              key={imageUploadKey}
              disabled={loading}
              onFileChange={setImageFile}
            />
            <ProductVariantsFields form={createForm} disabled={loading} />
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
                    <FormLabel>Đang bán</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Sản phẩm ngưng bán sẽ không xuất hiện khi chọn cho kịch
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