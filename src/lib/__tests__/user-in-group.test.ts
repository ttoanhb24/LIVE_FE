import { describe, expect, it } from "vitest"

import type { UserRole } from "@/interfaces/auth"
import { userInGroup } from "@/lib/roles"

describe("userInGroup", () => {
  it.each<[UserRole, boolean]>([
    ["MEMBER", false],
    ["LEADER", true],
    ["ADMIN", true],
  ])("%s thuộc nhóm staff (được thêm/sửa/xóa): %s", (role, expected) => {
    expect(userInGroup({ role }, "staff")).toBe(expected)
  })

  it.each<[UserRole, boolean]>([
    ["MEMBER", false],
    ["LEADER", false],
    ["ADMIN", true],
  ])("%s thuộc nhóm adminOnly: %s", (role, expected) => {
    expect(userInGroup({ role }, "adminOnly")).toBe(expected)
  })

  it("chưa đăng nhập thì không thuộc nhóm nào", () => {
    expect(userInGroup(null, "staff")).toBe(false)
    expect(userInGroup(undefined, "member")).toBe(false)
  })
})
