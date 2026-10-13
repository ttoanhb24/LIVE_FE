import { describe, expect, it } from "vitest"

import {
  fileFromDrop,
  imageFromClipboard,
  isDraggingFiles,
  isTextField,
} from "../utils/report-image-input"

function file(name: string, type: string): File {
  return new File(["x"], name, { type })
}

function fileItem(f: File) {
  return { kind: "file", type: f.type, getAsFile: () => f }
}

function textItem(type: string) {
  return { kind: "string", type, getAsFile: () => null }
}

describe("Dán ảnh (Ctrl+V / ⌘V) vào form kết thúc ca", () => {
  it("ảnh chụp màn hình vào bộ nhớ tạm (Win+Shift+S, ⌘+Ctrl+Shift+4) → nhận ảnh", () => {
    const shot = file("image.png", "image/png")

    expect(imageFromClipboard({ types: ["Files"], items: [fileItem(shot)] }, false)).toBe(shot)
  })

  it("con trỏ đang ở ô số mà bộ nhớ tạm chỉ có ảnh → vẫn nhận ảnh", () => {
    const shot = file("image.png", "image/png")

    expect(imageFromClipboard({ types: ["Files"], items: [fileItem(shot)] }, true)).toBe(shot)
  })

  it("'Sao chép hình ảnh' trên web/Zalo (kèm html) dán ngoài ô chữ → nhận ảnh", () => {
    const copied = file("image.png", "image/png")
    const data = { types: ["text/html", "Files"], items: [textItem("text/html"), fileItem(copied)] }

    expect(imageFromClipboard(data, false)).toBe(copied)
  })

  it("copy ô từ Excel/Sheets (chữ + ảnh vùng ô) dán vào ô số → để trình duyệt dán số", () => {
    const cellPicture = file("image.png", "image/png")
    const data = {
      types: ["text/plain", "text/html", "Files"],
      items: [textItem("text/plain"), textItem("text/html"), fileItem(cellPicture)],
    }

    expect(imageFromClipboard(data, true)).toBeNull()
  })

  it("file ảnh copy trong Finder/Explorer (chỉ có trong files) → nhận ảnh", () => {
    const copied = file("so-lieu.jpg", "image/jpeg")

    expect(imageFromClipboard({ types: ["Files"], items: [], files: [copied] }, false)).toBe(copied)
  })

  it("bộ nhớ tạm chỉ có chữ hoặc file không phải ảnh → bỏ qua", () => {
    expect(imageFromClipboard({ types: ["text/plain"], items: [textItem("text/plain")] }, false)).toBeNull()
    expect(
      imageFromClipboard({ types: ["Files"], files: [file("bao-cao.pdf", "application/pdf")] }, false)
    ).toBeNull()
    expect(imageFromClipboard(null, false)).toBeNull()
  })
})

describe("Đâu là ô gõ chữ/số", () => {
  it.each([
    [{ tagName: "INPUT", type: "number" }, true],
    [{ tagName: "INPUT", type: "text" }, true],
    [{ tagName: "INPUT" }, true],
    [{ tagName: "TEXTAREA" }, true],
    [{ tagName: "DIV", isContentEditable: true }, true],
    [{ tagName: "INPUT", type: "file" }, false],
    [{ tagName: "BUTTON" }, false],
    [{ tagName: "DIV" }, false],
  ])("%o → %s", (target, expected) => {
    expect(isTextField(target)).toBe(expected)
  })

  it("không có phần tử → không phải ô chữ", () => {
    expect(isTextField(null)).toBe(false)
  })
})

describe("Kéo thả ảnh vào form", () => {
  it("kéo file → bật vùng thả; kéo chữ/link → không", () => {
    expect(isDraggingFiles({ types: ["Files"] })).toBe(true)
    expect(isDraggingFiles({ types: ["text/plain", "text/uri-list"] })).toBe(false)
    expect(isDraggingFiles(null)).toBe(false)
  })

  it("thả nhiều file → lấy file đầu (báo cáo chỉ 1 ảnh)", () => {
    const first = file("a.png", "image/png")

    expect(fileFromDrop({ files: [first, file("b.png", "image/png")] })).toBe(first)
    expect(fileFromDrop({ files: [] })).toBeNull()
  })
})
