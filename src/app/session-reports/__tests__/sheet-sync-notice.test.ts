import { describe, expect, it } from "vitest"

import { sheetSyncNotice } from "../utils/sheet-sync-notice"

describe("Câu báo sau khi nộp báo cáo kết thúc ca", () => {
  it("ghi sheet được → báo tab và số dòng để đối chiếu", () => {
    expect(sheetSyncNotice({ status: "synced", tab: "BCDT T10/2026", row: 140 })).toEqual({
      level: "success",
      message: "Đã lưu báo cáo và ghi vào sheet (BCDT T10/2026, dòng 140)",
    })
  })

  it("ghi sheet lỗi → cảnh báo kèm lý do, nhắc báo leader nhập tay", () => {
    expect(
      sheetSyncNotice({
        status: "failed",
        message: 'Chưa có tab "BCDT T11/2026" trong file báo cáo',
      })
    ).toEqual({
      level: "warning",
      message:
        'Đã lưu báo cáo nhưng chưa ghi được vào Google Sheet: Chưa có tab "BCDT T11/2026" trong file báo cáo. Báo leader nhập tay dòng này.',
    })
  })

  it("BE chưa nối sheet → chỉ báo đã lưu như trước", () => {
    expect(sheetSyncNotice({ status: "skipped" })).toEqual({
      level: "success",
      message: "Đã lưu báo cáo ca live",
    })
  })
})
