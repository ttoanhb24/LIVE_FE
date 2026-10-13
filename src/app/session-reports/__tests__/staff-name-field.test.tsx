import { useForm } from "react-hook-form"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Form } from "@/components/ui/form"

import { StaffNameField } from "../components/StaffNameField"
import {
  sessionReportDefaultValues,
  type SessionReportFormInput,
} from "../schemas/session-report-form.schema"

function Harness({ names, loading }: { names: string[]; loading?: boolean }) {
  const form = useForm<SessionReportFormInput>({ defaultValues: sessionReportDefaultValues })
  return (
    <Form {...form}>
      <StaffNameField control={form.control} names={names} loading={loading} />
    </Form>
  )
}

describe("Ô tên nhân sự trên form kết thúc ca", () => {
  it("có danh sách tên từ sheet → ô chọn, không cho gõ tự do", () => {
    const html = renderToStaticMarkup(<Harness names={["Ngọc Sơn", "Duy Nam"]} />)

    expect(html).toContain('role="combobox"')
    expect(html).toContain("Chọn tên")
    expect(html).not.toContain("<input")
  })

  it("đang tải danh sách → ô chọn bị khoá, báo đang tải", () => {
    const html = renderToStaticMarkup(<Harness names={[]} loading />)

    expect(html).toContain("Đang tải danh sách tên...")
    expect(html).toContain("disabled")
  })

  it("chưa nối sheet / sheet lỗi (danh sách rỗng) → cho gõ tay như cũ", () => {
    const html = renderToStaticMarkup(<Harness names={[]} />)

    expect(html).toContain("<input")
    expect(html).not.toContain('role="combobox"')
  })
})
