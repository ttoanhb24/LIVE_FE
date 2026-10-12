import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { DatePickerFieldIso } from "@/components/FieldCustom/DatePickerField"
import { PageHeader } from "@/components/UiCustom/PageHeader"
import { Button } from "@/components/ui/button"

import { DailyRankingsBoard } from "./components/DailyRankingsBoard"
import { dailyRankingsQueryOptions } from "./queries/session-report-query"

export default function SessionRankingsPage() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  const { data, isLoading, isFetching } = useQuery({
    ...dailyRankingsQueryOptions({
      from: from || undefined,
      to: to || undefined,
    }),
  })

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Bảng thống kê các chỉ số theo ngày"
        description="Sau khi lấy dữ liệu trong ngày của các nhân sự đã điền."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <DatePickerFieldIso
          value={from}
          onChange={setFrom}
          placeholder="Từ ngày"
          className="w-full sm:w-44"
        />
        <DatePickerFieldIso
          value={to}
          onChange={setTo}
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
            }}
          >
            Bỏ lọc ngày
          </Button>
        ) : null}
      </div>

      <DailyRankingsBoard rankings={data} loading={isLoading || isFetching} />
    </div>
  )
}
