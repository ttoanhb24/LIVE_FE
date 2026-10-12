import { Link } from "react-router-dom"

import { mapLiveSessionToCues } from "@/app/home/mappers/map-live-session-to-cues"
import { Button } from "@/components/ui/button"
import { urlPaths } from "@/constants/urlPaths"
import { useIsStaff } from "@/lib/roles"

import { LiveConsole } from "./components/LiveConsole"
import { LiveSessionPicker } from "./components/LiveSessionPicker"
import { useHomeLiveSession } from "./hooks/use-home-live-session"

export default function HomePage() {
  const isStaff = useIsStaff()
  const {
    sessions,
    selectedSessionId,
    selectSession,
    session,
    isLoading,
    isError,
  } = useHomeLiveSession()

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Đang tải kịch bản live...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        <p className="text-sm text-destructive">Không tải được kịch bản live.</p>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-xs font-semibold tracking-[0.25em] text-muted-foreground uppercase">
          Phiên live
        </p>
        <h1 className="max-w-lg text-3xl font-bold tracking-tight md:text-4xl">
          Chưa có kịch bản nào
        </h1>
        {isStaff ? (
          <>
            <p className="max-w-md text-sm text-muted-foreground">
              Tạo phiên live mới để bắt đầu chạy kịch bản trên màn hình này.
            </p>
            <Button asChild size="lg" className="px-8">
              <Link to={urlPaths.liveSessionNew}>Tạo phiên live</Link>
            </Button>
          </>
        ) : (
          <p className="max-w-md text-sm text-muted-foreground">
            Liên hệ leader để tạo kịch bản cho phiên live.
          </p>
        )}
      </div>
    )
  }

  if (!session || !selectedSessionId) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Đang tải kịch bản live...</p>
      </div>
    )
  }

  const cues = mapLiveSessionToCues(session)

  if (cues.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-background">
        <header className="flex shrink-0 items-center border-b border-border bg-card px-4 py-3 md:px-6">
          <LiveSessionPicker
            sessions={sessions}
            selectedSessionId={selectedSessionId}
            onSessionChange={selectSession}
          />
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-muted-foreground uppercase">
            {session.name}
          </p>
          <h1 className="max-w-lg text-3xl font-bold tracking-tight md:text-4xl">
            Kịch bản trống
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Phiên này chưa có block nào. Hãy generate lại kịch bản hoặc chọn phiên khác.
          </p>
          <Button asChild variant="outline" size="lg" className="px-8">
            <Link to={urlPaths.liveSessionDetail(session.id)}>Xem kịch bản</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <LiveConsole
      key={session.id}
      sessions={sessions}
      selectedSessionId={selectedSessionId}
      onSessionChange={selectSession}
      cues={cues}
    />
  )
}
