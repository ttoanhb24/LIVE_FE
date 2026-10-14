import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, RefreshCw, Trash2 } from "lucide-react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { formatDuration } from "@/app/home/utils/format-duration"
import { LiveSessionDeleteDialog } from "@/app/live-sessions/components/LiveSessionDeleteDialog"
import { LiveSessionRegenerateDialog } from "@/app/live-sessions/components/LiveSessionRegenerateDialog"
import { LiveSessionTimeline } from "@/app/live-sessions/components/LiveSessionTimeline"
import { useLiveSessionMutations } from "@/app/live-sessions/hooks/use-live-session-mutations"
import { liveSessionDetailQueryOptions } from "@/app/live-sessions/queries/live-session-query"
import { SESSION_STATUS_LABELS } from "@/app/live-sessions/types/live-session"
import { PageHeader } from "@/components/UiCustom/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { urlPaths } from "@/constants/urlPaths"
import { useIsStaff } from "@/lib/roles"

export default function LiveSessionDetailPage() {
  // MEMBER xem được; generate lại/xóa chỉ LEADER + ADMIN.
  const isStaff = useIsStaff()
  const navigate = useNavigate()
  const { id = "" } = useParams()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [regenerateOpen, setRegenerateOpen] = useState(false)

  const { deleteMutation, regenerateMutation } = useLiveSessionMutations()

  const {
    data: session,
    isLoading,
    isError,
  } = useQuery({
    ...liveSessionDetailQueryOptions(id),
    enabled: !!id,
  })

  const canEdit = isStaff && session?.status === "DRAFT"

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title={session?.name ?? "Kịch bản live"}
        description={
          session
            ? `${session.productCount} sản phẩm · ${formatDuration(session.plannedSec)} kế hoạch`
            : "Đang tải timeline..."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {session ? (
              <Badge variant="secondary">
                {SESSION_STATUS_LABELS[session.status]}
              </Badge>
            ) : null}
            {canEdit ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRegenerateOpen(true)}
                >
                  <RefreshCw className="h-4 w-4" />
                  Generate lại
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa
                </Button>
              </>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(urlPaths.liveSessions)}
            >
              <ArrowLeft className="h-4 w-4" />
              Danh sách
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Đang tải kịch bản...</p>
      ) : isError || !session ? (
        <p className="text-sm text-destructive">Không tìm thấy kịch bản.</p>
      ) : (
        <LiveSessionTimeline segments={session.segments} />
      )}

      {isStaff ? (
        <>
          <LiveSessionDeleteDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            session={session ?? null}
            loading={deleteMutation.isPending}
            onConfirm={() => {
              if (!session) return
              deleteMutation.mutate(session.id, {
                onSuccess: () => navigate(urlPaths.liveSessions),
              })
            }}
          />

          <LiveSessionRegenerateDialog
            open={regenerateOpen}
            onOpenChange={setRegenerateOpen}
            loading={regenerateMutation.isPending}
            onConfirm={() => {
              if (!session) return
              regenerateMutation.mutate(session.id, {
                onSuccess: () => setRegenerateOpen(false),
              })
            }}
          />
        </>
      ) : null}
    </div>
  )
}
