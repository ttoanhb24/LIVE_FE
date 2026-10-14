import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useIsStaff } from "@/lib/roles"

import HomePage from "../HomePage"

vi.mock("@/lib/roles", () => ({ useIsStaff: vi.fn() }))

vi.mock("../hooks/use-home-live-session", () => ({
  useHomeLiveSession: () => ({
    sessions: [],
    selectedSessionId: null,
    selectSession: () => undefined,
    session: undefined,
    isLoading: false,
    isError: false,
  }),
}))

function renderHome(): string {
  return renderToStaticMarkup(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )
}

describe("Trang chủ khi chưa có phiên live", () => {
  beforeEach(() => {
    vi.mocked(useIsStaff).mockReset()
  })

  it("MEMBER thấy lời nhắc liên hệ leader, không có nút tạo phiên", () => {
    vi.mocked(useIsStaff).mockReturnValue(false)
    const html = renderHome()
    expect(html).toContain("Liên hệ leader để tạo kịch bản")
    expect(html).not.toContain("Tạo phiên live")
  })

  it("LEADER/ADMIN có nút Tạo phiên live", () => {
    vi.mocked(useIsStaff).mockReturnValue(true)
    const html = renderHome()
    expect(html).toContain("Tạo phiên live")
    expect(html).toContain('href="/live-sessions/new"')
  })
})
