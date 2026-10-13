import type { SheetSyncResult } from "../types/session-report"

export interface SheetSyncNotice {
  level: "success" | "warning"
  message: string
}

/**
 * Câu báo sau khi nộp. Báo cáo luôn đã lưu; chỉ khác ở bước chép sang Google Sheet báo cáo tổng —
 * lỗi thì phải nói rõ để người nộp báo leader nhập tay, không thì KPI trên sheet thiếu dòng này.
 */
export function sheetSyncNotice(sheetSync: SheetSyncResult): SheetSyncNotice {
  if (sheetSync.status === "synced") {
    return {
      level: "success",
      message: `Đã lưu báo cáo và ghi vào sheet (${sheetSync.tab}, dòng ${sheetSync.row})`,
    }
  }
  if (sheetSync.status === "failed") {
    return {
      level: "warning",
      message: `Đã lưu báo cáo nhưng chưa ghi được vào Google Sheet: ${sheetSync.message}. Báo leader nhập tay dòng này.`,
    }
  }
  return { level: "success", message: "Đã lưu báo cáo ca live" }
}
