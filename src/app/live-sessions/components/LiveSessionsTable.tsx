import type { ColumnDef } from "@tanstack/react-table"
import { Eye, Trash2 } from "lucide-react"

import { formatDuration } from "@/app/home/utils/format-duration"
import { DataTable } from "@/components/data-table/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  SESSION_STATUS_LABELS,
  type LiveSessionListItem,
  type SessionStatus,
} from "../types/live-session"

interface LiveSessionsTableProps {
  data: LiveSessionListItem[]
  loading?: boolean
  pageIndex: number
  pageCount: number
  onPageChange: (pageIndex: number) => void
  onView: (session: LiveSessionListItem) => void
  /** Bỏ trống thì ẩn nút xóa (MEMBER chỉ xem). */
  onDelete?: (session: LiveSessionListItem) => void
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("vi-VN")
}

function statusVariant(status: SessionStatus) {
  if (status === "DRAFT") return "secondary" as const
  if (status === "RUNNING") return "default" as const
  return "outline" as const
}

export function LiveSessionsTable({
  data,
  loading,
  pageIndex,
  pageCount,
  onPageChange,
  onView,
  onDelete,
}: LiveSessionsTableProps) {
  const columns: ColumnDef<LiveSessionListItem>[] = [
    {
      accessorKey: "name",
      header: "Tên phiên",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <Badge variant={statusVariant(row.original.status)}>
          {SESSION_STATUS_LABELS[row.original.status]}
        </Badge>
      ),
    },
    {
      accessorKey: "productCount",
      header: "Sản phẩm",
    },
    {
      accessorKey: "plannedSec",
      header: "Thời lượng",
      cell: ({ row }) => formatDuration(row.original.plannedSec),
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Xem ${row.original.name}`}
            onClick={() => onView(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {onDelete && row.original.status === "DRAFT" ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Xóa ${row.original.name}`}
              onClick={() => onDelete(row.original)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          ) : null}
        </div>
      ),
    },
  ]

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
