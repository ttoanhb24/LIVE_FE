import { describe, expect, it } from "vitest"

import { urlPaths } from "@/constants/urlPaths"

import { ADMIN_NAV_ITEMS, visibleAdminNavItems } from "../nav-items"

describe("visibleAdminNavItems", () => {
  it("MEMBER thấy 6 trang chỉ xem, không thấy Biểu cảm và Nhóm block", () => {
    expect(visibleAdminNavItems(false).map((item) => item.to)).toEqual([
      urlPaths.products,
      urlPaths.scriptBlocks,
      urlPaths.liveSessions,
      urlPaths.liveLookups,
      urlPaths.sessionReports,
      urlPaths.sessionRankings,
    ])
  })

  it("LEADER/ADMIN thấy đủ mục, giữ nguyên thứ tự", () => {
    expect(visibleAdminNavItems(true)).toEqual(ADMIN_NAV_ITEMS)
  })

  it("chỉ Biểu cảm và Nhóm block bị đánh dấu staffOnly", () => {
    expect(
      ADMIN_NAV_ITEMS.filter((item) => item.staffOnly).map((item) => item.to)
    ).toEqual([urlPaths.emotions, urlPaths.blockGroups])
  })
})
