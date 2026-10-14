import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"
import { useState } from "react"

import { DatePickerFieldIso } from "@/components/FieldCustom/DatePickerField"
import { PageHeader } from "@/components/UiCustom/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/types/pagination"

import { SessionReportsTable } from "./components/SessionReportsTable"
import { listSessionReportsQueryOptions } from "./queries/session-report-query"

export default function SessionReportsPage() {
  const [page, setPage] = useState(DEFAULT_PAGE)
  const [search, setSearch] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading, isFetching } = useQuery({
    ...listSessionReportsQueryOptions({
      page,
      limit: DEFAULT_LIMIT,
      q: debouncedSearch || undefined,
      from: from || undefined,
      to: to || undefined,
    }),
    placeholderData: keepPreviousData,
  })

  const reports = data?.data ?? []
  const meta = data?.meta
  const pageCount = Math.max(meta?.totalPages ?? 1, 1)
  const pageIndex = (meta?.page ?? page) - 1

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Báo cáo ca live"
        description="Số liệu nhân sự nộp sau khi kết thúc ca."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(DEFAULT_PAGE)
            }}
            placeholder="Tìm theo tên nhân sự..."
            className="pl-9"
          />
        </div>
        <DatePickerFieldIso
          value={from}
          onChange={(value) => {
            setFrom(value)
            setPage(DEFAULT_PAGE)
          }}
          placeholder="Từ ngày"
          className="w-full sm:w-44"
        />
        <DatePickerFieldIso
          value={to}
          onChange={(value) => {
            setTo(value)
            setPage(DEFAULT_PAGE)
          }}
          placeholder="Đến ngày"
          className="w-full sm:w-44"
        />
        {from || to ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setFrom("")
              setTo("")
              setPage(DEFAULT_PAGE)
            }}
          >
            Bỏ lọc ngày
          </Button>
        ) : null}
      </div>

      <SessionReportsTable
        data={reports}
        loading={isLoading || isFetching}
        pageIndex={pageIndex}
        pageCount={pageCount}
        onPageChange={(nextPageIndex) => setPage(nextPageIndex + 1)}
      />
    </div>
  )
}
