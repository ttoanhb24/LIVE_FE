export interface NavItem {
  to?: string
  label: string
  icon: React.ReactNode
  isHighlighted?: boolean
  children?: { label: string; to: string; staffOnly?: boolean }[]
  /** Chỉ LEADER + ADMIN thấy. Không đặt = MEMBER cũng thấy (trang chỉ xem). */
  staffOnly?: boolean
}

export interface ScrollFadeState {
  top: boolean
  bottom: boolean
}

export interface SidebarVariantProps {
  variant?: "desktop" | "drawer"
  onClose?: () => void
  onCollapse?: () => void
}
