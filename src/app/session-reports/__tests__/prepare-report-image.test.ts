import { describe, expect, it, vi } from "vitest"

import { prepareReportImage } from "../utils/prepare-report-image"

const MB = 1024 * 1024

function image(name: string, type: string, size: number): File {
  const file = new File(["x"], name, { type })
  Object.defineProperty(file, "size", { value: size })
  return file
}

describe("Chuẩn bị ảnh báo cáo trước khi tải lên", () => {
  it("ảnh hợp lệ → giữ nguyên, không nén", async () => {
    const shot = image("ca-sang.png", "image/png", 2 * MB)
    const shrink = vi.fn()

    await expect(prepareReportImage(shot, shrink)).resolves.toEqual({ file: shot, error: null })
    expect(shrink).not.toHaveBeenCalled()
  })

  it("ảnh chụp màn hình PNG quá 10MB → tự nén thành JPEG nhỏ hơn", async () => {
    const big = image("man-hinh-4k.png", "image/png", 14 * MB)
    const small = image("man-hinh-4k.jpg", "image/jpeg", 3 * MB)
    const shrink = vi.fn().mockResolvedValue(small)

    await expect(prepareReportImage(big, shrink)).resolves.toEqual({ file: small, error: null })
    expect(shrink).toHaveBeenCalledWith(big)
  })

  it("nén rồi vẫn quá 10MB → báo lỗi dung lượng", async () => {
    const big = image("anh.png", "image/png", 40 * MB)
    const shrink = vi.fn().mockResolvedValue(image("anh.jpg", "image/jpeg", 11 * MB))

    await expect(prepareReportImage(big, shrink)).resolves.toEqual({
      file: null,
      error: "Ảnh không được lớn hơn 10MB",
    })
  })

  it("trình duyệt không nén được → báo lỗi dung lượng như cũ", async () => {
    const big = image("anh.webp", "image/webp", 12 * MB)
    const shrink = vi.fn().mockRejectedValue(new Error("decode failed"))

    await expect(prepareReportImage(big, shrink)).resolves.toEqual({
      file: null,
      error: "Ảnh không được lớn hơn 10MB",
    })
  })

  it("sai loại file → báo lỗi ngay, không thử nén", async () => {
    const shrink = vi.fn()

    await expect(
      prepareReportImage(image("bao-cao.pdf", "application/pdf", 20 * MB), shrink)
    ).resolves.toEqual({ file: null, error: "Ảnh phải là JPG, PNG hoặc WEBP" })
    expect(shrink).not.toHaveBeenCalled()
  })

  it("ảnh HEIC của iPhone → hướng dẫn chụp màn hình rồi dán", async () => {
    const result = await prepareReportImage(image("IMG_0012.HEIC", "", 3 * MB), vi.fn())

    expect(result.file).toBeNull()
    expect(result.error).toContain("HEIC")
  })
})
