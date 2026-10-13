/**
 * Trần của từng ô số trong báo cáo ca — PHẢI khớp `LIVE_BE/src/session-reports/session-report-limits.ts`
 * (đặt theo kiểu cột DB). Lệch nhau thì FE cho qua mà BE từ chối, người nộp không hiểu vì sao.
 */
export const SESSION_REPORT_LIMITS = {
  totalHours: 24,
  revenue: 999_999_999_999.99,
  /** Thời gian giữ chân người xem, đơn vị GIÂY như cột trên sheet báo cáo tổng. */
  retentionSeconds: 999.99,
  count: 2_147_483_647,
} as const
