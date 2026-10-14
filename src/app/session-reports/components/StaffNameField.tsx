import type { Control } from "react-hook-form"

import { FormInput } from "@/components/FieldCustom/FormInput"
import { FormSelect } from "@/components/FieldCustom/FormSelect"

import type { SessionReportFormInput } from "../schemas/session-report-form.schema"

interface StaffNameFieldProps {
  control: Control<SessionReportFormInput>
  /** Tên trong ô chọn cột "Tên" của sheet báo cáo. Rỗng (chưa nối sheet / sheet lỗi) thì cho gõ tay. */
  names: string[]
  loading?: boolean
}

/**
 * Chọn đúng tên như trên sheet báo cáo tổng: công thức KPI của sheet cộng theo tên, gõ lệch một
 * chữ ("Ngoc Sơn", "ngọc sơn") là dòng đó không được tính.
 */
export function StaffNameField({ control, names, loading = false }: StaffNameFieldProps) {
  if (loading || names.length > 0) {
    return (
      <FormSelect
        control={control}
        name="staffName"
        label="Tên nhân sự"
        placeholder={loading ? "Đang tải danh sách tên..." : "Chọn tên"}
        options={names.map((name) => ({ value: name, label: name }))}
        disabled={loading}
        required
      />
    )
  }

  return <FormInput control={control} name="staffName" label="Tên nhân sự" required />
}
