import { describe, expect, it } from "vitest"

import { sessionReportFormSchema } from "../schemas/session-report-form.schema"

const valid = {
  liveDate: "2026-10-13",
  staffName: "Ngọc Sơn",
  shiftId: "s",
  liveTypeId: "l",
  teamId: "t",
  channelId: "c",
  totalHours: "4.5",
  revenue: "19957700",
  viewCount: "5350",
  retentionRate: "20",
  orderCount: "11",
  impressionCount: "271340",
}

function messages(patch: Partial<typeof valid>): string[] {
  const result = sessionReportFormSchema.safeParse({ ...valid, ...patch })
  return result.success ? [] : result.error.issues.map((issue) => issue.message)
}

describe("Form báo cáo kết thúc ca — kiểm số khớp BE", () => {
  it("báo cáo hợp lệ (có 4.5 giờ) không lỗi", () => {
    expect(messages({})).toEqual([])
  })

  it.each([
    ["revenue", "1000000000000", "Doanh thu quá lớn"],
    ["viewCount", "3000000000", "Số view quá lớn"],
    ["orderCount", "3000000000", "Tổng đơn quá lớn"],
    ["impressionCount", "3000000000", "Lượt hiển thị quá lớn"],
    ["totalHours", "25", "Tổng giờ live tối đa 24 giờ"],
    ["retentionRate", "1000", "Tỷ lệ giữ chân tối đa 999,99 giây"],
  ] as const)("%s = %s bị chặn ngay trên form", (field, value, message) => {
    expect(messages({ [field]: value })).toContain(message)
  })

  it("giữ chân tính bằng giây: 120 giây hợp lệ (trước đây chặn > 100 vì hiểu là %)", () => {
    expect(messages({ retentionRate: "120" })).toEqual([])
  })

  it("quá 2 số lẻ bị chặn như BE (trước đây FE cho qua, BE trả 400)", () => {
    expect(messages({ totalHours: "4.333" })).toContain(
      "Tổng giờ live phải >= 0, tối đa 2 số lẻ"
    )
  })

  it("view / đơn / lượt hiển thị phải là số nguyên", () => {
    expect(messages({ viewCount: "10.5" })).toContain("Số view phải là số nguyên >= 0")
  })

  it("chưa chọn tên thì nhắc chọn tên", () => {
    expect(messages({ staffName: " " })).toContain("Chọn tên nhân sự")
  })
})
