import { z } from "zod"

import { toIsoDate } from "@/lib/date-vi"

import { SESSION_REPORT_LIMITS } from "../constants/session-report-limits"

interface NumberRule {
  label: string
  max: number
  maxMessage: string
  /** Số nguyên (view, đơn, lượt hiển thị) hay cho tối đa 2 chữ số thập phân như BE. */
  integer?: boolean
}

function decimalPlaces(value: string): number {
  return value.includes(".") ? value.split(".")[1].length : 0
}

const requiredNumber = ({ label, max, maxMessage, integer = false }: NumberRule) =>
  z
    .string()
    .trim()
    .min(1, `Nhập ${label}`)
    .refine((value) => {
      const parsed = Number(value)
      if (!Number.isFinite(parsed) || parsed < 0) return false
      return integer ? Number.isInteger(parsed) : decimalPlaces(value) <= 2
    }, integer ? `${label} phải là số nguyên >= 0` : `${label} phải >= 0, tối đa 2 số lẻ`)
    .refine((value) => Number(value) <= max, maxMessage)

export const sessionReportFormSchema = z.object({
  liveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Chọn ngày live"),
  staffName: z.string().trim().min(1, "Chọn tên nhân sự").max(100),
  shiftId: z.string().min(1, "Chọn ca live"),
  liveTypeId: z.string().min(1, "Chọn phân loại live"),
  teamId: z.string().min(1, "Chọn team"),
  channelId: z.string().min(1, "Chọn kênh live"),
  totalHours: requiredNumber({
    label: "Tổng giờ live",
    max: SESSION_REPORT_LIMITS.totalHours,
    maxMessage: "Tổng giờ live tối đa 24 giờ",
  }),
  revenue: requiredNumber({
    label: "Doanh thu",
    max: SESSION_REPORT_LIMITS.revenue,
    maxMessage: "Doanh thu quá lớn",
  }),
  viewCount: requiredNumber({
    label: "Số view",
    max: SESSION_REPORT_LIMITS.count,
    maxMessage: "Số view quá lớn",
    integer: true,
  }),
  retentionRate: requiredNumber({
    label: "Tỷ lệ giữ chân",
    max: SESSION_REPORT_LIMITS.retentionSeconds,
    maxMessage: "Tỷ lệ giữ chân tối đa 999,99 giây",
  }),
  orderCount: requiredNumber({
    label: "Tổng đơn",
    max: SESSION_REPORT_LIMITS.count,
    maxMessage: "Tổng đơn quá lớn",
    integer: true,
  }),
  impressionCount: requiredNumber({
    label: "Lượt hiển thị",
    max: SESSION_REPORT_LIMITS.count,
    maxMessage: "Lượt hiển thị quá lớn",
    integer: true,
  }),
})

export type SessionReportFormInput = z.input<typeof sessionReportFormSchema>
export type SessionReportFormValues = z.output<typeof sessionReportFormSchema>

export const sessionReportDefaultValues: SessionReportFormInput = {
  liveDate: toIsoDate(new Date()),
  staffName: "",
  shiftId: "",
  liveTypeId: "",
  teamId: "",
  channelId: "",
  totalHours: "",
  revenue: "",
  viewCount: "",
  retentionRate: "",
  orderCount: "",
  impressionCount: "",
}
