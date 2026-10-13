import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getApiErrorMessage } from "@/lib/get-api-error-message"

import { sessionReportKeys } from "../queries/session-report-query"
import { createSessionReport } from "../services/sessionReportService"
import type { CreateSessionReportPayload } from "../types/session-report"
import { sheetSyncNotice } from "../utils/sheet-sync-notice"

export function useSessionReportMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (payload: CreateSessionReportPayload) =>
      createSessionReport(payload),
    onSuccess: async (report) => {
      await queryClient.invalidateQueries({ queryKey: sessionReportKeys.all })
      const notice = sheetSyncNotice(report.sheetSync)
      if (notice.level === "warning") {
        // Cần người nộp đọc kịp để báo leader — giữ lâu hơn toast thường.
        toast.warning(notice.message, { duration: 15_000 })
      } else {
        toast.success(notice.message)
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không lưu được báo cáo ca live"))
    },
  })

  return { createMutation }
}
