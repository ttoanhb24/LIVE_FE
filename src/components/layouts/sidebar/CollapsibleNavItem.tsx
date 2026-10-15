import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"

import { cn } from "@/lib/utils"

import type { NavItem } from "./types"

interface CollapsibleNavItemProps {
  item: NavItem
}

export function CollapsibleNavItem({ item }: CollapsibleNavItemProps) {
  const location = useLocation()

  const activeChildTo = item.children?.reduce((prev, curr) => {
    if (location.pathname.startsWith(curr.to) && curr.to.length > prev.length) {
      return curr.to
    }
    return prev
  }, "")

  const isActive = activeChildTo !== ""
  const [isOpen, setIsOpen] = useState(isActive || false)

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group flex items-center justify-between gap-3 rounded-lg px-4 py-2 text-sm transition-all",
          isActive
            ? "bg-emerald-900/40 text-white"
            : "bg-primary hover:bg-emerald-900/40"
        )}
      >
        <div className="flex items-center gap-3">
          {item.icon}
          {item.label}
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      {isOpen && (
        <div className="mt-1 ml-6 flex flex-col space-y-1 border-l border-white/20 pl-2">
          {item.children?.map((child) => {
            const isChildActive = child.to === activeChildTo
            // Mục con đang mở: cùng kiểu với mục menu thường đang mở (NavGroup).
            return (
              <NavLink
                key={child.to}
                to={child.to}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm transition-all",
                  isChildActive
                    ? "border-l-4 border-l-lime-400 bg-[#014D4E] text-white"
                    : "text-white/80 hover:bg-emerald-900/40 hover:text-white"
                )}
              >
                {child.label}
              </NavLink>
            )
          })}
        </div>
      )}
    </div>
  )
}
