import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { LiveSessionDeleteDialog } from "@/app/live-sessions/components/LiveSessionDeleteDialog"
import { LiveSessionsTable } from "@/app/live-sessions/components/LiveSessionsTable"
import { useLiveSessionMutations } from "@/app/live-sessions/hooks/use-live-session-mutations"
import { listLiveSessionsQueryOptions } from "@/app/live-sessions/queries/live-session-query"
import {
  SESSION_STATUSES,
  SESSION_STATUS_LABELS,
  type LiveSessionListItem,
  type SessionStatus,
} from "@/app/live-sessions/types/live-session"
import { PageHeader } from "@/components/UiCustom/PageHeader"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { urlPaths } from "@/constants/urlPaths"
import { useIsStaff } from "@/lib/roles"
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/types/pagination"

const ALL_STATUS_VALUE = "ALL"

export default function LiveSessionsPage() {
  // MEMBER xem được; tạo/xóa chỉ LEADER + ADMIN.
  const isStaff = useIsStaff()
  const navigate = useNavigate()

  const [page, setPage] = useState(DEFAULT_PAGE)
  const [statusFilter, setStatusFilter] = useState<SessionStatus | undefined>()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingSession, setDeletingSession] =
    useState<LiveSessionListItem | null>(null)

  const { deleteMutation } = useLiveSessionMutations()

  const { data, isLoading, isFetching } = useQuery({
    ...listLiveSessionsQueryOptions({
      page,
      limit: DEFAULT_LIMIT,
      status: statusFilter,
    }),
    placeholderData: keepPreviousData,
  })

  const sessions = data?.data ?? []
  const meta = data?.meta
  const pageCount = Math.max(meta?.totalPages ?? 1, 1)
  const pageIndex = (meta?.page ?? page) - 1

  function handleStatusChange(value: string) {
    setStatusFilter(value === ALL_STATUS_VALUE ? undefined : (value as SessionStatus))
    setPage(DEFAULT_PAGE)
  }

  function handleDeleteConfirm() {
    if (!deletingSession) return
    deleteMutation.mutate(deletingSession.id, {
      onSuccess: () => {
        setDeleteOpen(false)
        setDeletingSession(null)
      },
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Kịch bản live"
        description="Xếp bước mở đầu, sản phẩm, CTA, trò chơi, kết thúc theo ý bạn. Lên sóng chỉ việc chọn phiên nháp."
        actions={
          isStaff ? (
            <Button type="button" onClick={() => navigate(urlPaths.liveSessionNew)}>
              <Plus className="h-4 w-4" />
              Tạo kịch bản
            </Button>
          ) : undefined
        }
      />

      <Select
        value={statusFilter ?? ALL_STATUS_VALUE}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-full sm:w-56">
          <SelectValue placeholder="Lọc trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_STATUS_VALUE}>Tất cả trạng thái</SelectItem>
          {SESSION_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {SESSION_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <LiveSessionsTable
        data={sessions}
        loading={isLoading || isFetching}
        pageIndex={pageIndex}
        pageCount={pageCount}
        onPageChange={(nextPageIndex) => setPage(nextPageIndex + 1)}
        onView={(session) => navigate(urlPaths.liveSessionDetail(session.id))}
        onDelete={
          isStaff
            ? (session) => {
                setDeletingSession(session)
                setDeleteOpen(true)
              }
            : undefined
        }
      />

      {isStaff ? (
        <LiveSessionDeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          session={deletingSession}
          loading={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
        />
      ) : null}
    </div>
  )
}
