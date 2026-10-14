import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Plus, Search } from "lucide-react"
import { useState } from "react"

import { PageHeader } from "@/components/UiCustom/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MODAL_MODE, type ModalModeType } from "@/constants/common"
import { useDebounce } from "@/hooks/useDebounce"
import { useIsStaff } from "@/lib/roles"
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/types/pagination"

import { LiveLookupDeleteDialog } from "./components/LiveLookupDeleteDialog"
import { LiveLookupFormDialog } from "./components/LiveLookupFormDialog"
import { LiveLookupsTable } from "./components/LiveLookupsTable"
import {
  LIVE_LOOKUP_KIND,
  LIVE_LOOKUP_TABS,
  type LiveLookupKind,
} from "./constants/live-lookup-kind"
import { useLiveLookupMutations } from "./hooks/use-live-lookup-mutations"
import { listLiveLookupsQueryOptions } from "./queries/live-lookup-query"
import type { LiveLookupFormValues } from "./schemas/live-lookup-form.schema"
import type { LiveLookup } from "./types/live-lookup"

export default function LiveLookupsPage() {
  // MEMBER xem được; thêm/sửa/xóa chỉ LEADER + ADMIN.
  const isStaff = useIsStaff()

  const [kind, setKind] = useState<LiveLookupKind>(LIVE_LOOKUP_KIND.SHIFT)
  const [page, setPage] = useState(DEFAULT_PAGE)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<ModalModeType>(MODAL_MODE.ADD)
  const [selected, setSelected] = useState<LiveLookup | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState<LiveLookup | null>(null)

  const { createMutation, updateMutation, deleteMutation } =
    useLiveLookupMutations()

  const tab =
    LIVE_LOOKUP_TABS.find((item) => item.kind === kind) ?? LIVE_LOOKUP_TABS[0]

  const { data, isLoading, isFetching } = useQuery({
    ...listLiveLookupsQueryOptions({
      page,
      limit: DEFAULT_LIMIT,
      kind,
      q: debouncedSearch || undefined,
    }),
    placeholderData: keepPreviousData,
  })

  const lookups = data?.data ?? []
  const meta = data?.meta
  const pageCount = Math.max(meta?.totalPages ?? 1, 1)
  const pageIndex = (meta?.page ?? page) - 1
  const tableLoading = isLoading || isFetching
  const formLoading = createMutation.isPending || updateMutation.isPending

  function openCreateDialog() {
    setFormMode(MODAL_MODE.ADD)
    setSelected(null)
    setFormOpen(true)
  }

  function openEditDialog(lookup: LiveLookup) {
    setFormMode(MODAL_MODE.EDIT)
    setSelected(lookup)
    setFormOpen(true)
  }

  function openDeleteDialog(lookup: LiveLookup) {
    setDeleting(lookup)
    setDeleteOpen(true)
  }

  function handleSubmit(values: LiveLookupFormValues) {
    if (formMode === MODAL_MODE.EDIT && selected) {
      updateMutation.mutate(
        { id: selected.id, name: values.name },
        { onSuccess: () => setFormOpen(false) }
      )
      return
    }

    createMutation.mutate(
      { kind, name: values.name },
      { onSuccess: () => setFormOpen(false) }
    )
  }

  function handleDeleteConfirm() {
    if (!deleting) return

    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        setDeleteOpen(false)
        setDeleting(null)
      },
    })
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(DEFAULT_PAGE)
  }

  function handleTabChange(value: string) {
    setKind(value as LiveLookupKind)
    setPage(DEFAULT_PAGE)
    setSearch("")
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Danh mục live"
        description="Ca, phân loại, team và kênh dùng khi kết thúc ca."
        actions={
          isStaff ? (
            <Button type="button" onClick={openCreateDialog}>
              <Plus className="h-4 w-4" />
              {tab.addLabel}
            </Button>
          ) : undefined
        }
      />

      <Tabs value={kind} onValueChange={handleTabChange}>
        <TabsList>
          {LIVE_LOOKUP_TABS.map((item) => (
            <TabsTrigger key={item.kind} value={item.kind}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Tìm theo tên..."
          className="pl-9"
        />
      </div>

      <LiveLookupsTable
        data={lookups}
        loading={tableLoading}
        pageIndex={pageIndex}
        pageCount={pageCount}
        onPageChange={(nextPageIndex) => setPage(nextPageIndex + 1)}
        onEdit={isStaff ? openEditDialog : undefined}
        onDelete={isStaff ? openDeleteDialog : undefined}
      />

      {isStaff ? (
        <>
          <LiveLookupFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            mode={formMode}
            name={selected?.name}
            title={formMode === MODAL_MODE.EDIT ? `Sửa ${tab.label}` : tab.addLabel}
            loading={formLoading}
            onSubmit={handleSubmit}
          />

          <LiveLookupDeleteDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            lookup={deleting}
            loading={deleteMutation.isPending}
            onConfirm={handleDeleteConfirm}
          />
        </>
      ) : null}
    </div>
  )
}
