import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getApiErrorMessage } from "@/lib/get-api-error-message"

import { sessionReportKeys } from "../queries/session-report-query"
import {
  createSessionReport,
  uploadReportImage,
} from "../services/sessionReportService"
import { sheetSyncNotice } from "../utils/sheet-sync-notice"
import {
  submitSessionReport,
  type SubmitSessionReportInput,
} from "../utils/submit-session-report"

export function useSessionReportMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (input: SubmitSessionReportInput) =>
      submitSessionReport(input, {
        uploadImage: uploadReportImage,
        createReport: createSessionReport,
      }),
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
