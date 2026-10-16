import { ConfirmDialog } from "@/components/UiCustom/DialogConfirm"

import { getBlockTypeLabel } from "../constants/block-type"
import type { BlockGroup } from "../types/block-group"

interface BlockGroupDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  blockGroup: BlockGroup | null
  loading?: boolean
  onConfirm: () => void
}

export function BlockGroupDeleteDialog({
  open,
  onOpenChange,
  blockGroup,
  loading,
  onConfirm,
}: BlockGroupDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Xóa nhóm CTA"
      message={
        blockGroup
          ? `Bạn có chắc muốn xóa nhóm "${blockGroup.name}" (${getBlockTypeLabel(blockGroup.type)} / ${blockGroup.code})?`
          : "Bạn có chắc muốn xóa nhóm CTA này?"
      }
      loading={loading}
      onConfirm={onConfirm}
    />
  )
}
