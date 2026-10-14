import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"

import { DataTable } from "@/components/data-table/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import type { Product } from "../types/product"

interface ProductsTableProps {
  data: Product[]
  loading?: boolean
  pageIndex: number
  pageCount: number
  onPageChange: (pageIndex: number) => void
  /** Bỏ trống cả hai thì ẩn cột thao tác (MEMBER chỉ xem). */
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
}

function formatPrice(product: Product): string {
  const prices = product.variants
    .map((variant) => (variant.price ? Number(variant.price) : null))
    .filter((value): value is number => value !== null)

  if (prices.length === 0) return "—"

  const min = Math.min(...prices)
  const max = Math.max(...prices)

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  })

  if (min === max) return formatter.format(min)
  return `${formatter.format(min)} – ${formatter.format(max)}`
}

function formatStock(product: Product): string {
  const total = product.variants.reduce((sum, variant) => sum + variant.stock, 0)
  return product.variants.length > 0 ? String(total) : "—"
}

export function ProductsTable({
  data,
  loading,
  pageIndex,
  pageCount,
  onPageChange,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "code",
      header: "Mã",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Tên sản phẩm",
    },
    {
      accessorKey: "images",
      header: "Ảnh",
      cell: ({ row }) =>
        row.original.images[0] ? (
          <img
            src={row.original.images[0]}
            alt={row.original.name}
            className="h-10 w-10 rounded-md border object-cover"
          />
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
    {
      accessorKey: "productType",
      header: "Loại",
      cell: ({ row }) => row.original.productType ?? "—",
    },
    {
      id: "variants",
      header: "Biến thể",
      cell: ({ row }) => row.original.variants.length,
    },
    {
      id: "price",
      header: "Giá",
      cell: ({ row }) => formatPrice(row.original),
    },
    {
      id: "stock",
      header: "Tồn",
      cell: ({ row }) => formatStock(row.original),
    },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      cell: ({ row }) =>
        row.original.isActive ? (
          <Badge variant="secondary">Đang bán</Badge>
        ) : (
          <Badge variant="outline">Ngưng</Badge>
        ),
    },
  ]

  if (onEdit && onDelete) {
    columns.push({
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Sửa ${row.original.name}`}
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Xóa ${row.original.name}`}
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    })
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      pageIndex={pageIndex}
      pageCount={pageCount}
      onPageChange={onPageChange}
    />
  )
}
