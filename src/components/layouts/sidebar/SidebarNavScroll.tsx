import { ChevronsDown } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

import { NavGroup } from "./NavGroup"
import { ADMIN_ONLY_NAV_ITEMS, visibleAdminNavItems } from "./nav-items"
import type { NavItem, ScrollFadeState } from "./types"

interface SidebarNavScrollProps {
  showSettings?: boolean
  showAdminOnly?: boolean
  operationItems?: NavItem[]
  salesItems?: NavItem[]
}

export function SidebarNavScroll({
  showSettings,
  showAdminOnly,
  operationItems,
  salesItems,
}: SidebarNavScrollProps) {
  const adminItems = visibleAdminNavItems(Boolean(showSettings))
  const scrollRef = useRef<HTMLDivElement>(null)
  const [fade, setFade] = useState<ScrollFadeState>({
    top: false,
    bottom: false,
  })

  const updateScrollFade = useCallback(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    const hasOverflow = scrollEl.scrollHeight > scrollEl.clientHeight
    const isAtTop = scrollEl.scrollTop <= 1
    const isAtBottom =
      scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 1

    setFade({
      top: hasOverflow && !isAtTop,
      bottom: hasOverflow && !isAtBottom,
    })
  }, [])

  useEffect(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    updateScrollFade()

    const resizeObserver = new ResizeObserver(updateScrollFade)
    resizeObserver.observe(scrollEl)

    const nav = scrollEl.firstElementChild
    if (nav) {
      resizeObserver.observe(nav)
    }

    return () => resizeObserver.disconnect()
  }, [showSettings, showAdminOnly, operationItems, salesItems, updateScrollFade])

  return (
    <div className="relative min-h-0 overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={updateScrollFade}
        className="scrollbar-hide h-full overflow-y-auto overscroll-contain"
      >
        <nav className="space-y-6 px-3 py-2 pt-4 pb-3" id="nav-groups">
          {operationItems && operationItems.length > 0 ? (
            <NavGroup title="HOẠT ĐỘNG" items={operationItems} />
          ) : null}
          {showAdminOnly && ADMIN_ONLY_NAV_ITEMS.length > 0 ? (
            <NavGroup title="HỆ THỐNG" items={ADMIN_ONLY_NAV_ITEMS} />
          ) : null}
          {adminItems.length > 0 ? (
            <NavGroup title="QUẢN TRỊ" items={adminItems} />
          ) : null}
        </nav>
      </div>

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-linear-to-b from-emerald-950 via-emerald-950/70 to-transparent transition-opacity duration-300",
          fade.top ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 transition-opacity duration-300",
          fade.bottom ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="h-14 bg-linear-to-t from-emerald-950 via-emerald-950/80 to-transparent" />
        <ChevronsDown className="absolute bottom-1.5 left-1/2 h-4 w-4 -translate-x-1/2 text-lime-400/80" />
      </div>
    </div>
  )
}
