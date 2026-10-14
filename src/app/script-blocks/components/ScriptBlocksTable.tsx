import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"

import {
  BLOCK_TYPE_LABELS,
  type BlockType,
} from "@/app/block-groups/constants/block-type"
import { DataTable } from "@/components/data-table/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import type { ScriptBlock } from "../types/script-block"

interface ScriptBlocksTableProps {
  data: ScriptBlock[]
  loading?: boolean
  pageIndex: number
  pageCount: number
  onPageChange: (pageIndex: number) => void
  /** Bỏ trống cả hai thì ẩn cột thao tác (MEMBER chỉ xem). */
  onEdit?: (block: ScriptBlock) => void
  onDelete?: (block: ScriptBlock) => void
}

function excerpt(text: string, max = 80): string {
  const trimmed = text.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max)}…`
}

export function ScriptBlocksTable({
  data,
  loading,
  pageIndex,
  pageCount,
  onPageChange,
  onEdit,
  onDelete,
}: ScriptBlocksTableProps) {
  const columns: ColumnDef<ScriptBlock>[] = [
    {
      accessorKey: "type",
      header: "Loại",
      cell: ({ row }) => (
        <Badge variant="outline">
          {BLOCK_TYPE_LABELS[row.original.type as BlockType]}
        </Badge>
      ),
    },
    {
      id: "summary",
      header: "Nội dung",
      cell: ({ row }) => (
        <div className="max-w-md space-y-1">
          {row.original.title ? (
            <p className="text-sm font-medium">{row.original.title}</p>
          ) : null}
          <p className="text-sm text-muted-foreground">
            {excerpt(row.original.content)}
          </p>
        </div>
      ),
    },
    {
      id: "scope",
      header: "Phạm vi",
      cell: ({ row }) => {
        if (row.original.productName) {
          return (
            <span className="text-sm">
              {row.original.productCode} — {row.original.productName}
            </span>
          )
        }
        if (row.original.groupName) {
          return <span className="text-sm">{row.original.groupName}</span>
        }
        return <span className="text-sm text-muted-foreground">Dùng chung</span>
      },
    },
    {
      accessorKey: "durationSec",
      header: "Thời lượng",
      cell: ({ row }) => <span className="text-sm">{row.original.durationSec}s</span>,
    },
    {
      id: "emotions",
      header: "Biểu cảm",
      cell: ({ row }) =>
        row.original.emotions.length ? (
          <span className="text-sm">{row.original.emotions.map((e) => e.name).join(", ")}</span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Hoạt động" : "Tắt"}
        </Badge>
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
            aria-label="Sửa block"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Xóa block"
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
