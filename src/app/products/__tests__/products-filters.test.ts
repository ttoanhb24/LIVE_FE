import { beforeEach, describe, expect, it, vi } from "vitest"

const http = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }))
vi.mock("@/services/httpService", () => ({ default: http }))

import { listProductsQueryOptions } from "../queries/product-query"

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
