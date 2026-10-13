import { describe, expect, it } from "vitest"

import { validateReportImageFile } from "../constants/report-image"

function image(type: string, size = 200_000): File {
  const file = new File(["x"], "so-lieu-ca", { type })
  Object.defineProperty(file, "size", { value: size })
  return file
}

describe("Ảnh báo cáo kết thúc ca — kiểm file trước khi tải lên", () => {
  it("chưa chọn ảnh → bắt buộc chọn", () => {
    expect(validateReportImageFile(null)).toBe("Chọn ảnh báo cáo")
  })

  it.each(["image/jpeg", "image/png", "image/webp"])("%s hợp lệ", (type) => {
    expect(validateReportImageFile(image(type))).toBeNull()
  })

  it.each(["image/gif", "application/pdf", "video/mp4"])("%s bị chặn", (type) => {
    expect(validateReportImageFile(image(type))).toBe("Ảnh phải là JPG, PNG hoặc WEBP")
  })

  it.each([
    ["image/heic", "IMG_0012.HEIC"],
    ["image/heif", "anh.heif"],
    ["", "IMG_0013.heic"],
  ])("ảnh iPhone %s (%s) → báo rõ là HEIC, không báo sai loại chung chung", (type, name) => {
    expect(validateReportImageFile(new File(["x"], name, { type }))).toContain("HEIC")
  })

  it("ảnh hơn 10MB bị chặn (giống BE)", () => {
    expect(validateReportImageFile(image("image/png", 11 * 1024 * 1024))).toBe(
      "Ảnh không được lớn hơn 10MB"
    )
  })
})
