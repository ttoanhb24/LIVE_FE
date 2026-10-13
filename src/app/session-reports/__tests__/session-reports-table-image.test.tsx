import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { SessionReportsTable } from "../components/SessionReportsTable"
import type { SessionReport } from "../types/session-report"

const IMAGE_URL =
  "https://res.cloudinary.com/jsmkvfyg/image/upload/v1/LIVE_VCB/session-reports/abc.png"

const lookup = { id: "x", name: "x" }
const report: SessionReport = {
  id: "r1",
  sessionId: "s1",
  sessionName: "Live tối 13/10",
  submittedById: "u1",
  liveDate: "2026-10-13",
  staffName: "Ngọc Sơn",
  shift: lookup,
  liveType: lookup,
  team: lookup,
  channel: lookup,
  totalHours: 4.5,
  revenue: 5000000,
  viewCount: 1000,
  retentionRate: 20,
  orderCount: 3,
  impressionCount: 50000,
  imageUrl: IMAGE_URL,
  createdAt: "2026-10-13T10:00:00.000Z",
  updatedAt: "2026-10-13T10:00:00.000Z",
}

function render(rows: SessionReport[]): string {
  return renderToStaticMarkup(
    <SessionReportsTable data={rows} pageIndex={0} pageCount={1} onPageChange={() => undefined} />
  )
}

describe("Cột Ảnh ở trang Báo cáo ca", () => {
  it("báo cáo có ảnh → ảnh nhỏ, bấm mở ảnh gốc ở tab mới", () => {
    const html = render([report])

    expect(html).toContain(">Ảnh<")
    expect(html).toContain(`href="${IMAGE_URL}"`)
    expect(html).toContain('target="_blank"')
    expect(html).toContain(`src="${IMAGE_URL}"`)
    expect(html).toContain('aria-label="Xem ảnh báo cáo của Ngọc Sơn"')
  })

  it("báo cáo cũ chưa có ảnh → hiện gạch ngang", () => {
    const html = render([{ ...report, imageUrl: null }])

    expect(html).not.toContain("<img")
    expect(html).toContain("—")
  })
})
