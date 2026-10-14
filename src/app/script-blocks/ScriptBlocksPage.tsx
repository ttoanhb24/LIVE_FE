import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { FileText, Plus, Search } from "lucide-react"
import { useState } from "react"

import {
  SCRIPT_BLOCK_TYPE_OPTIONS,
  type BlockType,
} from "@/app/block-groups/constants/block-type"
import { ScriptBlockDeleteDialog } from "@/app/script-blocks/components/ScriptBlockDeleteDialog"
import { ScriptBlockFormDialog } from "@/app/script-blocks/components/ScriptBlockFormDialog"
import { ScriptBlocksTable } from "@/app/script-blocks/components/ScriptBlocksTable"
import { useScriptBlockMutations } from "@/app/script-blocks/hooks/use-script-block-mutations"
import { listScriptBlocksQueryOptions } from "@/app/script-blocks/queries/script-block-query"
import type {
  CreateScriptBlockFormValues,
  UpdateScriptBlockFormValues,
} from "@/app/script-blocks/schemas/script-block-form.schema"
import type { ScriptBlock } from "@/app/script-blocks/types/script-block"
import { PageHeader } from "@/components/UiCustom/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MODAL_MODE } from "@/constants/common"
import { useDebounce } from "@/hooks/useDebounce"
import { useIsStaff } from "@/lib/roles"
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/types/pagination"

const ALL_TYPES_VALUE = "ALL"

export default function ScriptBlocksPage() {
  // MEMBER xem được; thêm/sửa/xóa chỉ LEADER + ADMIN.
  const isStaff = useIsStaff()

  const [page, setPage] = useState(DEFAULT_PAGE)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<BlockType | undefined>()
  const debouncedSearch = useDebounce(search, 300)

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<(typeof MODAL_MODE)[keyof typeof MODAL_MODE]>(
    MODAL_MODE.ADD
  )
  const [selectedBlock, setSelectedBlock] = useState<ScriptBlock | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingBlock, setDeletingBlock] = useState<ScriptBlock | null>(null)

  const { createMutation, updateMutation, deleteMutation } = useScriptBlockMutations()

  const { data, isLoading, isFetching } = useQuery({
    ...listScriptBlocksQueryOptions({
      page,
      limit: DEFAULT_LIMIT,
      q: debouncedSearch || undefined,
      type: typeFilter,
    }),
    placeholderData: keepPreviousData,
  })

  const scriptBlocks = data?.data ?? []
  const meta = data?.meta
  const pageCount = Math.max(meta?.totalPages ?? 1, 1)
  const pageIndex = (meta?.page ?? page) - 1
  const tableLoading = isLoading || isFetching

  function openCreateDialog() {
    setFormMode(MODAL_MODE.ADD)
    setSelectedBlock(null)
    setFormOpen(true)
  }

  function openEditDialog(block: ScriptBlock) {
    setFormMode(MODAL_MODE.EDIT)
    setSelectedBlock(block)
    setFormOpen(true)
  }

  function openDeleteDialog(block: ScriptBlock) {
    setDeletingBlock(block)
    setDeleteOpen(true)
  }

  function handleCreate(values: CreateScriptBlockFormValues) {
    createMutation.mutate(values, { onSuccess: () => setFormOpen(false) })
  }

  function handleUpdate(values: UpdateScriptBlockFormValues) {
    if (!selectedBlock) return

    updateMutation.mutate(
      { id: selectedBlock.id, values },
      { onSuccess: () => setFormOpen(false) }
    )
  }

  function handleDeleteConfirm() {
    if (!deletingBlock) return

    deleteMutation.mutate(deletingBlock.id, {
      onSuccess: () => {
        setDeleteOpen(false)
        setDeletingBlock(null)
      },
    })
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(DEFAULT_PAGE)
  }

  function handleTypeFilterChange(value: string) {
    setTypeFilter(value === ALL_TYPES_VALUE ? undefined : (value as BlockType))
    setPage(DEFAULT_PAGE)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Kho nội dung"
        description="Quản lý block kịch bản dùng khi generate timeline livestream."
        actions={
          isStaff ? (
            <Button type="button" onClick={openCreateDialog}>
              <Plus className="h-4 w-4" />
              Thêm block
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Tìm theo tiêu đề hoặc nội dung..."
            className="pl-9"
          />
        </div>
        <Select
          value={typeFilter ?? ALL_TYPES_VALUE}
          onValueChange={handleTypeFilterChange}
        >
          <SelectTrigger className="w-full sm:w-56">
            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Lọc theo loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_TYPES_VALUE}>Tất cả loại</SelectItem>
            {SCRIPT_BLOCK_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScriptBlocksTable
        data={scriptBlocks}
        loading={tableLoading}
        pageIndex={pageIndex}
        pageCount={pageCount}
        onPageChange={(nextPageIndex) => setPage(nextPageIndex + 1)}
        onEdit={isStaff ? openEditDialog : undefined}
        onDelete={isStaff ? openDeleteDialog : undefined}
      />

      {isStaff ? (
        <>
          <ScriptBlockFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            mode={formMode}
            scriptBlock={selectedBlock}
            loading={createMutation.isPending || updateMutation.isPending}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
          />

          <ScriptBlockDeleteDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            scriptBlock={deletingBlock}
            loading={deleteMutation.isPending}
            onConfirm={handleDeleteConfirm}
          />
        </>
      ) : null}
    </div>
  )
}
