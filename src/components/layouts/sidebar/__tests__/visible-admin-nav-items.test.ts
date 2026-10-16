import { describe, expect, it } from "vitest"

import { urlPaths } from "@/constants/urlPaths"

import { ADMIN_NAV_ITEMS, visibleAdminNavItems } from "../nav-items"

describe("visibleAdminNavItems", () => {
  it("MEMBER thấy 6 trang chỉ xem; Kho nội dung là link thường vì không thấy Nhóm CTA", () => {
    const items = visibleAdminNavItems(false)

    expect(items.map((item) => item.to)).toEqual([
      urlPaths.products,
      urlPaths.scriptBlocks,
      urlPaths.liveSessions,
      urlPaths.liveLookups,
      urlPaths.sessionReports,
      urlPaths.sessionRankings,
    ])
    expect(items.some((item) => item.children)).toBe(false)
  })

  it("LEADER/ADMIN thấy đủ; Kho nội dung xổ ra Nội dung và Nhóm CTA", () => {
    expect(visibleAdminNavItems(true)).toEqual(ADMIN_NAV_ITEMS)
    const content = ADMIN_NAV_ITEMS.find(
      (item) => item.label === "Kho nội dung"
    )
    expect(content?.children).toEqual([
      { label: "Nội dung", to: urlPaths.scriptBlocks },
      { label: "Nhóm CTA", to: urlPaths.blockGroups, staffOnly: true },
    ])
  })

  it("chỉ Biểu cảm và Nhóm CTA bị đánh dấu staffOnly", () => {
    const all = ADMIN_NAV_ITEMS.flatMap((item) => [
      item,
      ...(item.children ?? []),
    ])
    expect(all.filter((item) => item.staffOnly).map((item) => item.to)).toEqual(
      [urlPaths.emotions, urlPaths.blockGroups]
    )
  })
})
