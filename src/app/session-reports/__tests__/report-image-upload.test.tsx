import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { ReportImageUpload } from "../components/ReportImageUpload"

describe("Ô ảnh báo cáo trên form kết thúc ca", () => {
  it("chỉ rõ các cách thêm ảnh: dán, kéo thả, chọn từ máy, phím chụp màn hình", () => {
    const html = renderToStaticMarkup(<ReportImageUpload onFileChange={() => {}} />)

    expect(html).toContain("Dán ảnh (Ctrl+V / ⌘V)")
    expect(html).toContain("kéo thả vào đây")
    expect(html).toContain("chọn từ máy")
    expect(html).toContain("Win + Shift + S")
    expect(html).toContain("⌘ + Ctrl + Shift + 4")
    expect(html).toContain('accept="image/jpeg,image/png,image/webp"')
  })

  it("form báo thiếu ảnh → hiện lỗi dưới ô ảnh", () => {
    const html = renderToStaticMarkup(
      <ReportImageUpload error="Chọn ảnh báo cáo" onFileChange={() => {}} />
    )

    expect(html).toContain("Chọn ảnh báo cáo</p>")
    expect(html).toContain("border-destructive")
  })
})
