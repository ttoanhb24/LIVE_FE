import {
  BarChart3,
  ClipboardList,
  Clapperboard,
  Home,
  Package,
  ScrollText,
  Smile,
  Tags,
  Users,
} from "lucide-react"

import { urlPaths } from "@/constants/urlPaths"

import type { NavItem } from "./types"

export const OPERATION_NAV_ITEMS: NavItem[] = [
  {
    to: urlPaths.home,
    label: "Trang chủ",
    icon: <Home className="h-4 w-4" />,
  },
]

export const KPI_NAV_ITEMS: NavItem[] = []

export const SALES_NAV_ITEMS: NavItem[] = []

/** Chỉ ADMIN — quản lý người dùng. */
export const ADMIN_ONLY_NAV_ITEMS: NavItem[] = [
  {
    to: urlPaths.users,
    label: "Người dùng",
    icon: <Users className="h-4 w-4" />,
  },
]

/** MEMBER thấy các mục không có `staffOnly` — chỉ xem, không thêm/sửa/xóa. */
export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    to: urlPaths.emotions,
    label: "Biểu cảm",
    icon: <Smile className="h-4 w-4" />,
    staffOnly: true,
  },
  {
    to: urlPaths.products,
    label: "Sản phẩm",
    icon: <Package className="h-4 w-4" />,
  },
  {
    label: "Kho nội dung",
    icon: <ScrollText className="h-4 w-4" />,
    children: [
      { label: "Nội dung", to: urlPaths.scriptBlocks },
      { label: "Nhóm CTA", to: urlPaths.blockGroups, staffOnly: true },
    ],
  },
  {
    to: urlPaths.liveSessions,
    label: "Kịch bản live",
    icon: <Clapperboard className="h-4 w-4" />,
  },

  {
    to: urlPaths.liveLookups,
    label: "Danh mục",
    icon: <Tags className="h-4 w-4" />,
  },
  {
    to: urlPaths.sessionReports,
    label: "Báo cáo ca",
    icon: <ClipboardList className="h-4 w-4" />,
  },
  {
    to: urlPaths.sessionRankings,
    label: "Thống kê ngày",
    icon: <BarChart3 className="h-4 w-4" />,
  },
]

/**
 * Mục "QUẢN TRỊ" theo quyền: LEADER + ADMIN thấy hết, MEMBER bỏ mục `staffOnly` (cả mục con).
 * Còn đúng một mục con (MEMBER ở "Kho nội dung") thì hiện thành link thường, khỏi xổ menu.
 */
export function visibleAdminNavItems(isStaff: boolean): NavItem[] {
  if (isStaff) return ADMIN_NAV_ITEMS
  return ADMIN_NAV_ITEMS.filter((item) => !item.staffOnly).map((item) => {
    const children = item.children?.filter((child) => !child.staffOnly)
    if (children?.length === 1)
      return { ...item, to: children[0].to, children: undefined }
    return children ? { ...item, children } : item
  })
}
