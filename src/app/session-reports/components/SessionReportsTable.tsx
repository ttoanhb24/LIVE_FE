import type { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table/data-table"

import type { SessionReport } from "../types/session-report"

interface SessionReportsTableProps {
  data: SessionReport[]
  loading?: boolean
  pageIndex: number
  pageCount: number
  onPageChange: (pageIndex: number) => void
}

function formatIsoDate(value: string): string {
  const [year, month, day] = value.split("-")
  return day && month && year ? `${day}/${month}/${year}` : value
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value)
}

export function SessionReportsTable({
  data,
  loading,
  pageIndex,
  pageCount,
  onPageChange,
}: SessionReportsTableProps) {
  const columns: ColumnDef<SessionReport>[] = [
    {
      accessorKey: "liveDate",
      header: "Ngày live",
      cell: ({ row }) => formatIsoDate(row.original.liveDate),
    },
    { accessorKey: "staffName", header: "Nhân sự" },
    {
      id: "shift",
      header: "Ca",
      cell: ({ row }) => row.original.shift.name,
    },
    {
      id: "liveType",
      header: "Phân loại",
      cell: ({ row }) => row.original.liveType.name,
    },
    {
      id: "team",
      header: "Team",
      cell: ({ row }) => row.original.team.name,
    },
    {
      id: "channel",
      header: "Kênh",
      cell: ({ row }) => row.original.channel.name,
    },
    {
      accessorKey: "totalHours",
      header: "Giờ live",
      cell: ({ row }) => formatNumber(row.original.totalHours),
    },
    {
      accessorKey: "revenue",
      header: "Doanh thu",
      cell: ({ row }) => formatNumber(row.original.revenue),
    },
    {
      accessorKey: "viewCount",
      header: "View",
      cell: ({ row }) => formatNumber(row.original.viewCount),
    },
    {
      accessorKey: "retentionRate",
      header: "Giữ chân (giây)",
      cell: ({ row }) => formatNumber(row.original.retentionRate),
    },
    {
      accessorKey: "orderCount",
      header: "Đơn",
      cell: ({ row }) => formatNumber(row.original.orderCount),
    },
    {
      accessorKey: "impressionCount",
      header: "Hiển thị",
      cell: ({ row }) => formatNumber(row.original.impressionCount),
    },
    { accessorKey: "sessionName", header: "Kịch bản" },
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
