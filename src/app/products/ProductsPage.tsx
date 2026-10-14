import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Plus, Search } from "lucide-react"
import { useState } from "react"

import { ProductDeleteDialog } from "@/app/products/components/ProductDeleteDialog"
import { ProductFormDialog } from "@/app/products/components/ProductFormDialog"
import { ProductsTable } from "@/app/products/components/ProductsTable"
import { useProductMutations } from "@/app/products/hooks/use-product-mutations"
import { listProductsQueryOptions } from "@/app/products/queries/product-query"
import { mapVariantFormToPayload } from "@/app/products/schemas/product-form.schema"
import type {
  CreateProductFormValues,
  UpdateProductFormValues,
} from "@/app/products/schemas/product-form.schema"
import type { Product } from "@/app/products/types/product"
import { PageHeader } from "@/components/UiCustom/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MODAL_MODE } from "@/constants/common"
import { useDebounce } from "@/hooks/useDebounce"
import { useIsStaff } from "@/lib/roles"
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/types/pagination"

export default function ProductsPage() {
  // MEMBER xem được; thêm/sửa/xóa chỉ LEADER + ADMIN.
  const isStaff = useIsStaff()

  const [page, setPage] = useState(DEFAULT_PAGE)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<(typeof MODAL_MODE)[keyof typeof MODAL_MODE]>(
    MODAL_MODE.ADD
  )
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  const { createMutation, updateMutation, deleteMutation } = useProductMutations()

  const { data, isLoading, isFetching } = useQuery({
    ...listProductsQueryOptions({
      page,
      limit: DEFAULT_LIMIT,
      q: debouncedSearch || undefined,
    }),
    placeholderData: keepPreviousData,
  })

  const products = data?.data ?? []
  const meta = data?.meta
  const pageCount = Math.max(meta?.totalPages ?? 1, 1)
  const pageIndex = (meta?.page ?? page) - 1
  const tableLoading = isLoading || isFetching

  function openCreateDialog() {
    setFormMode(MODAL_MODE.ADD)
    setSelectedProduct(null)
    setFormOpen(true)
  }

  function openEditDialog(product: Product) {
    setFormMode(MODAL_MODE.EDIT)
    setSelectedProduct(product)
    setFormOpen(true)
  }

  function openDeleteDialog(product: Product) {
    setDeletingProduct(product)
    setDeleteOpen(true)
  }

  function handleCreate(values: CreateProductFormValues, imageFile: File | null) {
    createMutation.mutate(
      {
        payload: {
          code: values.code,
          name: values.name,
          description: values.description?.trim() || undefined,
          isActive: values.isActive,
          variants: mapVariantFormToPayload(values.variants),
        },
        imageFile,
      },
      { onSuccess: () => setFormOpen(false) }
    )
  }

  function handleUpdate(values: UpdateProductFormValues, imageFile: File | null) {
    if (!selectedProduct) return

    updateMutation.mutate(
      {
        id: selectedProduct.id,
        payload: {
          name: values.name,
          description: values.description?.trim() || undefined,
          isActive: values.isActive,
          variants: mapVariantFormToPayload(values.variants),
        },
        imageFile,
        existingProduct: selectedProduct,
      },
      { onSuccess: () => setFormOpen(false) }
    )
  }

  function handleDeleteConfirm() {
    if (!deletingProduct) return

    deleteMutation.mutate(deletingProduct.id, {
      onSuccess: () => {
        setDeleteOpen(false)
        setDeletingProduct(null)
      },
    })
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(DEFAULT_PAGE)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Sản phẩm"
        description="Quản lý mã hàng và biến thể. Liên kết Sapo và danh mục sẽ bổ sung sau."
        actions={
          isStaff ? (
            <Button type="button" onClick={openCreateDialog}>
              <Plus className="h-4 w-4" />
              Thêm sản phẩm
            </Button>
          ) : undefined
        }
      />

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Tìm theo tên hoặc mã..."
          className="pl-9"
        />
      </div>

      <ProductsTable
        data={products}
        loading={tableLoading}
        pageIndex={pageIndex}
        pageCount={pageCount}
        onPageChange={(nextPageIndex) => setPage(nextPageIndex + 1)}
        onEdit={isStaff ? openEditDialog : undefined}
        onDelete={isStaff ? openDeleteDialog : undefined}
      />

      {isStaff ? (
        <>
          <ProductFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            mode={formMode}
            product={selectedProduct}
            loading={createMutation.isPending || updateMutation.isPending}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
          />

          <ProductDeleteDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            product={deletingProduct}
            loading={deleteMutation.isPending}
            onConfirm={handleDeleteConfirm}
          />
        </>
      ) : null}
    </div>
  )
}
