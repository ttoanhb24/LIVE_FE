import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { LiveLookupsTable } from "@/app/live-lookups/components/LiveLookupsTable"
import type { LiveLookup } from "@/app/live-lookups/types/live-lookup"
import { LiveSessionsTable } from "@/app/live-sessions/components/LiveSessionsTable"
import type { LiveSessionListItem } from "@/app/live-sessions/types/live-session"
import { ProductsTable } from "@/app/products/components/ProductsTable"
import type { Product } from "@/app/products/types/product"
import { ScriptBlocksTable } from "@/app/script-blocks/components/ScriptBlocksTable"
import type { ScriptBlock } from "@/app/script-blocks/types/script-block"

const noop = () => undefined
const paging = { pageIndex: 0, pageCount: 1, onPageChange: noop }
const timestamps = { createdAt: "2026-10-12T00:00:00.000Z", updatedAt: "2026-10-12T00:00:00.000Z" }

const product: Product = {
  id: "p1",
  code: "VCB-NN001",
  name: "Nhẫn Hoa Mai",
  categoryId: null,
  categoryName: null,
  attributes: null,
  description: null,
  images: [],
  videoUrl: null,
  sapoId: null,
  sapoUrl: null,
  isActive: true,
  variants: [],
  ...timestamps,
}

const block: ScriptBlock = {
  id: "b1",
  type: "STORY",
  groupId: null,
  groupCode: null,
  groupName: null,
  productId: "p1",
  productCode: "VCB-NN001",
  productName: "Nhẫn Hoa Mai",
  title: "Chuyện nhẫn",
  content: "Nội dung câu chuyện",
  durationSec: 60,
  weight: 1,
  sortOrder: 0,
  usageCount: 0,
  lastUsedAt: null,
  isActive: true,
  emotions: [],
  ...timestamps,
}

const session: LiveSessionListItem = {
  id: "s1",
  name: "Live tối 12/10",
  scheduledAt: null,
  plannedSec: 1800,
  status: "DRAFT",
  productCount: 4,
  ...timestamps,
}

const lookup: LiveLookup = { id: "l1", kind: "SHIFT", name: "Ca tối", ...timestamps }

/** Không truyền onEdit/onDelete (MEMBER) thì không có nút sửa/xóa; truyền đủ (STAFF) thì có. */
describe("Bảng chỉ xem cho MEMBER", () => {
  it("ProductsTable", () => {
    const readOnly = renderToStaticMarkup(<ProductsTable data={[product]} {...paging} />)
    expect(readOnly).toContain("VCB-NN001")
    expect(readOnly).not.toContain("Thao tác")
    expect(readOnly).not.toContain('aria-label="Sửa')
    expect(readOnly).not.toContain('aria-label="Xóa')

    const staff = renderToStaticMarkup(
      <ProductsTable data={[product]} {...paging} onEdit={noop} onDelete={noop} />
    )
    expect(staff).toContain('aria-label="Sửa Nhẫn Hoa Mai"')
    expect(staff).toContain('aria-label="Xóa Nhẫn Hoa Mai"')
  })

  it("ScriptBlocksTable", () => {
    const readOnly = renderToStaticMarkup(<ScriptBlocksTable data={[block]} {...paging} />)
    expect(readOnly).toContain("Chuyện nhẫn")
    expect(readOnly).not.toContain('aria-label="Sửa block"')
    expect(readOnly).not.toContain('aria-label="Xóa block"')

    const staff = renderToStaticMarkup(
      <ScriptBlocksTable data={[block]} {...paging} onEdit={noop} onDelete={noop} />
    )
    expect(staff).toContain('aria-label="Sửa block"')
    expect(staff).toContain('aria-label="Xóa block"')
  })

  it("LiveSessionsTable: MEMBER vẫn có nút Xem, không có nút Xóa", () => {
    const readOnly = renderToStaticMarkup(
      <LiveSessionsTable data={[session]} {...paging} onView={noop} />
    )
    expect(readOnly).toContain('aria-label="Xem Live tối 12/10"')
    expect(readOnly).not.toContain('aria-label="Xóa Live tối 12/10"')

    const staff = renderToStaticMarkup(
      <LiveSessionsTable data={[session]} {...paging} onView={noop} onDelete={noop} />
    )
    expect(staff).toContain('aria-label="Xóa Live tối 12/10"')
  })

  it("LiveLookupsTable", () => {
    const readOnly = renderToStaticMarkup(<LiveLookupsTable data={[lookup]} {...paging} />)
    expect(readOnly).toContain("Ca tối")
    expect(readOnly).not.toContain('aria-label="Sửa Ca tối"')
    expect(readOnly).not.toContain('aria-label="Xóa Ca tối"')

    const staff = renderToStaticMarkup(
      <LiveLookupsTable data={[lookup]} {...paging} onEdit={noop} onDelete={noop} />
    )
    expect(staff).toContain('aria-label="Sửa Ca tối"')
    expect(staff).toContain('aria-label="Xóa Ca tối"')
  })
})
