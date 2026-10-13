import type { DailyRankingRow, DailyRankings } from "../types/session-report"

interface DailyRankingsBoardProps {
  rankings?: DailyRankings
  loading?: boolean
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value)
}

const COLUMNS: {
  key: keyof Pick<DailyRankings, "revenue" | "traffic" | "retention">
  title: string
  format: (value: number) => string
}[] = [
  {
    key: "revenue",
    title: "Tổng doanh thu xếp hạng ai cao nhất",
    format: formatNumber,
  },
  {
    key: "traffic",
    title: "Tổng traffic ai đạt được cao nhất trong ngày",
    format: formatNumber,
  },
  {
    key: "retention",
    title: "Tổng trung bình tỷ lệ giữ chân cao nhất",
    format: (value) => `${formatNumber(value)} giây`,
  },
]

interface RankingColumnProps {
  title: string
  rows: DailyRankingRow[]
  format: (value: number) => string
}

function RankingColumn({ title, rows, format }: RankingColumnProps) {
  return (
    <section className="min-w-0">
      <header className="border-b bg-muted/50 px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Xếp theo thứ tự từ cao → thấp
        </p>
      </header>
      {rows.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">Chưa có dữ liệu</p>
      ) : (
        <ol>
          {rows.map((row) => (
            <li
              key={row.staffName}
              className="flex items-baseline justify-between gap-3 border-b px-4 py-2 text-sm last:border-b-0"
            >
              <span className="min-w-0 truncate">
                <span className="mr-2 tabular-nums text-muted-foreground">{row.rank}.</span>
                {row.staffName}
              </span>
              <span className="shrink-0 tabular-nums font-medium">{format(row.value)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export function DailyRankingsBoard({ rankings, loading }: DailyRankingsBoardProps) {
  if (loading && !rankings) {
    return <p className="text-sm text-muted-foreground">Đang tải bảng xếp hạng...</p>
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="grid grid-cols-1 divide-y lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {COLUMNS.map((column) => (
          <RankingColumn
            key={column.key}
            title={column.title}
            rows={rankings?.[column.key] ?? []}
            format={column.format}
          />
        ))}
      </div>
    </div>
  )
}
