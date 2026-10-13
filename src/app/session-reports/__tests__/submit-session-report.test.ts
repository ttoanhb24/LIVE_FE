import { describe, expect, it, vi } from "vitest"

import type { SessionReportFormValues } from "../schemas/session-report-form.schema"
import type { CreateSessionReportResponse } from "../types/session-report"
import { submitSessionReport } from "../utils/submit-session-report"

const IMAGE_URL =
  "https://res.cloudinary.com/jsmkvfyg/image/upload/v1/LIVE_VCB/session-reports/abc.png"

const values = {
  liveDate: "2026-10-13",
  staffName: "Ngọc Sơn",
  shiftId: "s",
  liveTypeId: "l",
  teamId: "t",
  channelId: "c",
  totalHours: "4.5",
  revenue: "5000000",
  viewCount: "1000",
  retentionRate: "20",
  orderCount: "3",
  impressionCount: "50000",
} as SessionReportFormValues

const imageFile = new File(["x"], "so-lieu.png", { type: "image/png" })

describe("Nộp báo cáo kết thúc ca kèm ảnh", () => {
  it("tải ảnh trước, rồi nộp báo cáo kèm đúng link ảnh vừa nhận", async () => {
    const calls: string[] = []
    const uploadImage = vi.fn(async () => {
      calls.push("upload")
      return { imageUrl: IMAGE_URL }
    })
    const createReport = vi.fn(async () => {
      calls.push("create")
      return { id: "r1" } as CreateSessionReportResponse
    })

    await submitSessionReport(
      { values, sessionId: "session-1", imageFile },
      { uploadImage, createReport }
    )

    expect(calls).toEqual(["upload", "create"])
    expect(uploadImage).toHaveBeenCalledWith(imageFile)
    expect(createReport).toHaveBeenCalledWith({
      ...values,
      sessionId: "session-1",
      imageUrl: IMAGE_URL,
    })
  })

  it("tải ảnh lỗi → dừng, không nộp báo cáo thiếu ảnh", async () => {
    const createReport = vi.fn()

    await expect(
      submitSessionReport(
        { values, sessionId: "session-1", imageFile },
        { uploadImage: vi.fn().mockRejectedValue(new Error("mạng lỗi")), createReport }
      )
    ).rejects.toThrow("mạng lỗi")
    expect(createReport).not.toHaveBeenCalled()
  })
})
