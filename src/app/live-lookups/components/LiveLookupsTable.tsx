import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"

import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"

import type { LiveLookup } from "../types/live-lookup"

interface LiveLookupsTableProps {
  data: LiveLookup[]
  loading?: boolean
  pageIndex: number
  pageCount: number
  onPageChange: (pageIndex: number) => void
  /** Bỏ trống cả hai thì ẩn cột thao tác (MEMBER chỉ xem). */
  onEdit?: (lookup: LiveLookup) => void
  onDelete?: (lookup: LiveLookup) => void
}

export function LiveLookupsTable({
  data,
  loading,
  pageIndex,
  pageCount,
  onPageChange,
  onEdit,
  onDelete,
}: LiveLookupsTableProps) {
  const columns: ColumnDef<LiveLookup>[] = [
    {
      accessorKey: "name",
      header: "Tên",
    },
  ]

  if (onEdit && onDelete) {
    columns.push({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
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
