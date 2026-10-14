import {
  BarChart3,
  ClipboardList,
  Clapperboard,
  Home,
  Layers,
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
    to: urlPaths.blockGroups,
    label: "Nhóm block",
    icon: <Layers className="h-4 w-4" />,
    staffOnly: true,
  },
  {
    to: urlPaths.products,
    label: "Sản phẩm",
    icon: <Package className="h-4 w-4" />,
  },
  {
    to: urlPaths.scriptBlocks,
    label: "Kho nội dung",
    icon: <ScrollText className="h-4 w-4" />,
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

/** Mục "QUẢN TRỊ" theo quyền: LEADER + ADMIN thấy hết, MEMBER bỏ mục `staffOnly`. */
export function visibleAdminNavItems(isStaff: boolean): NavItem[] {
  return isStaff ? ADMIN_NAV_ITEMS : ADMIN_NAV_ITEMS.filter((item) => !item.staffOnly)
}
