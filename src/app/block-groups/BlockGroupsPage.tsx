import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Layers, Plus, Search } from "lucide-react"
import { useState } from "react"
import { Navigate } from "react-router-dom"

import { BlockGroupDeleteDialog } from "@/app/block-groups/components/BlockGroupDeleteDialog"
import { BlockGroupFormDialog } from "@/app/block-groups/components/BlockGroupFormDialog"
import { BlockGroupsTable } from "@/app/block-groups/components/BlockGroupsTable"
import {
  BLOCK_GROUP_TYPE_OPTIONS,
  type BlockType,
} from "@/app/block-groups/constants/block-type"
import { useBlockGroupMutations } from "@/app/block-groups/hooks/use-block-group-mutations"
import { listBlockGroupsQueryOptions } from "@/app/block-groups/queries/block-group-query"
import type {
  CreateBlockGroupFormValues,
  UpdateBlockGroupFormValues,
} from "@/app/block-groups/schemas/block-group-form.schema"
import type { BlockGroup } from "@/app/block-groups/types/block-group"
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
import { urlPaths } from "@/constants/urlPaths"
import { useDebounce } from "@/hooks/useDebounce"
import { useIsStaff } from "@/lib/roles"
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/types/pagination"

const ALL_TYPES_VALUE = "ALL"

export default function BlockGroupsPage() {
  const isStaff = useIsStaff()

  const [page, setPage] = useState(DEFAULT_PAGE)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<BlockType | undefined>()
  const debouncedSearch = useDebounce(search, 300)

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<(typeof MODAL_MODE)[keyof typeof MODAL_MODE]>(
    MODAL_MODE.ADD
  )
  const [selectedBlockGroup, setSelectedBlockGroup] = useState<BlockGroup | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingBlockGroup, setDeletingBlockGroup] = useState<BlockGroup | null>(null)

  const { createMutation, updateMutation, deleteMutation } = useBlockGroupMutations()

  const { data, isLoading, isFetching } = useQuery({
    ...listBlockGroupsQueryOptions({
      page,
      limit: DEFAULT_LIMIT,
      q: debouncedSearch || undefined,
      type: typeFilter,
    }),
    placeholderData: keepPreviousData,
    enabled: isStaff,
  })

  if (!isStaff) {
    return <Navigate to={urlPaths.home} replace />
  }

  const blockGroups = data?.data ?? []
  const meta = data?.meta
  const pageCount = Math.max(meta?.totalPages ?? 1, 1)
  const pageIndex = (meta?.page ?? page) - 1
  const tableLoading = isLoading || isFetching

  function openCreateDialog() {
    setFormMode(MODAL_MODE.ADD)
    setSelectedBlockGroup(null)
    setFormOpen(true)
  }

  function openEditDialog(blockGroup: BlockGroup) {
    setFormMode(MODAL_MODE.EDIT)
    setSelectedBlockGroup(blockGroup)
    setFormOpen(true)
  }

  function openDeleteDialog(blockGroup: BlockGroup) {
    setDeletingBlockGroup(blockGroup)
    setDeleteOpen(true)
  }

  function handleCreate(values: CreateBlockGroupFormValues) {
    createMutation.mutate(values, { onSuccess: () => setFormOpen(false) })
  }

  function handleUpdate(values: UpdateBlockGroupFormValues) {
    if (!selectedBlockGroup) return

    updateMutation.mutate(
      { id: selectedBlockGroup.id, payload: values },
      { onSuccess: () => setFormOpen(false) }
    )
  }

  function handleDeleteConfirm() {
    if (!deletingBlockGroup) return

    deleteMutation.mutate(deletingBlockGroup.id, {
      onSuccess: () => {
        setDeleteOpen(false)
        setDeletingBlockGroup(null)
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
        title="Nhóm CTA"
        description="Chia nội dung kêu gọi hành động thành các nhóm: Tương tác, Chốt đơn, Social proof..."
        actions={
          <Button type="button" onClick={openCreateDialog}>
            <Plus className="h-4 w-4" />
            Thêm nhóm CTA
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Tìm theo tên hoặc mã..."
            className="pl-9"
          />
        </div>
        <Select
          value={typeFilter ?? ALL_TYPES_VALUE}
          onValueChange={handleTypeFilterChange}
        >
          <SelectTrigger className="w-full sm:w-56">
            <Layers className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Lọc theo loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_TYPES_VALUE}>Tất cả loại</SelectItem>
            {BLOCK_GROUP_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <BlockGroupsTable
        data={blockGroups}
        loading={tableLoading}
        pageIndex={pageIndex}
        pageCount={pageCount}
        onPageChange={(nextPageIndex) => setPage(nextPageIndex + 1)}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />

      <BlockGroupFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        blockGroup={selectedBlockGroup}
        loading={createMutation.isPending || updateMutation.isPending}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      <BlockGroupDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        blockGroup={deletingBlockGroup}
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
