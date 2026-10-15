import { beforeEach, describe, expect, it, vi } from "vitest"

const http = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }))
vi.mock("@/services/httpService", () => ({ default: http }))

import { listProductsQueryOptions } from "../queries/product-query"
import { runSapoSync } from "../services/productService"

beforeEach(() => vi.clearAllMocks())

describe("Bộ lọc trang Sản phẩm", () => {
  it("gửi trạng thái, loại, khoảng giá lên API", async () => {
    http.get.mockResolvedValue({ data: { data: [], meta: {} } })
    const filters = {
      isActive: false,
      productType: "NHẪN",
      minPrice: 1000,
      maxPrice: 5000,
    }

    const options = listProductsQueryOptions(filters)
    await options.queryFn?.({} as never)

    expect(options.queryKey).toEqual([
      "products",
      "list",
      { page: 1, limit: 20, q: undefined, ...filters },
    ])
    expect(http.get).toHaveBeenCalledWith("/products", {
      params: { page: 1, limit: 20, q: undefined, ...filters },
    })
  })
})

describe("Nút Đồng bộ Sapo", () => {
  it("bắt đầu đồng bộ rồi hỏi lại tới khi BE chạy xong", async () => {
    const result = { total: 2, created: 1, updated: 1, deactivated: 0 }
    http.post.mockResolvedValue({
      data: { running: true, result: null, error: null },
    })
    http.get
      .mockResolvedValueOnce({
        data: { running: true, result: null, error: null },
      })
      .mockResolvedValueOnce({ data: { running: false, result, error: null } })

    const status = await runSapoSync(0)

    expect(http.post).toHaveBeenCalledWith("/products/sapo-sync")
    expect(http.get).toHaveBeenCalledTimes(2)
    expect(status).toEqual({ running: false, result, error: null })
  })
})
