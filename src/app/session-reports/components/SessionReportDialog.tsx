import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"

import {
  LIVE_LOOKUP_KIND,
  type LiveLookupKind,
} from "@/app/live-lookups/constants/live-lookup-kind"
import { listLiveLookupsQueryOptions } from "@/app/live-lookups/queries/live-lookup-query"
import { toIsoDate } from "@/lib/date-vi"
import { FormDate } from "@/components/FieldCustom/FormDate"
import { FormInput } from "@/components/FieldCustom/FormInput"
import { FormSelect, type FormSelectOption } from "@/components/FieldCustom/FormSelect"
import { FormDialog } from "@/components/UiCustom/FormDialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import { useSessionReportMutations } from "../hooks/use-session-report-mutations"
import { staffNamesQueryOptions } from "../queries/session-report-query"
import {
  sessionReportDefaultValues,
  sessionReportFormSchema,
  type SessionReportFormInput,
  type SessionReportFormValues,
} from "../schemas/session-report-form.schema"
import { StaffNameField } from "./StaffNameField"

interface SessionReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionId: string
}

function useLookupOptions(kind: LiveLookupKind, enabled: boolean) {
  const query = useQuery({
    ...listLiveLookupsQueryOptions({ kind, page: 1, limit: 100 }),
    enabled,
  })

  const options: FormSelectOption[] = (query.data?.data ?? []).map((row) => ({
    value: row.id,
    label: row.name,
  }))

  return { options, isLoading: query.isLoading }
}

export function SessionReportDialog({
  open,
  onOpenChange,
  sessionId,
}: SessionReportDialogProps) {
  const { createMutation } = useSessionReportMutations()
  const shifts = useLookupOptions(LIVE_LOOKUP_KIND.SHIFT, open)
  const liveTypes = useLookupOptions(LIVE_LOOKUP_KIND.LIVE_TYPE, open)
  const teams = useLookupOptions(LIVE_LOOKUP_KIND.TEAM, open)
  const channels = useLookupOptions(LIVE_LOOKUP_KIND.CHANNEL, open)

  const form = useForm<SessionReportFormInput>({
    resolver: zodResolver(sessionReportFormSchema),
    defaultValues: sessionReportDefaultValues,
  })

  const liveDate = useWatch({ control: form.control, name: "liveDate" })
  const staffNames = useQuery({
    ...staffNamesQueryOptions(liveDate),
    enabled: open && /^\d{4}-\d{2}-\d{2}$/.test(liveDate),
  })

  useEffect(() => {
    if (open) {
      form.reset({
        ...sessionReportDefaultValues,
        liveDate: toIsoDate(new Date()),
      })
    }
  }, [open, form])

  function handleSubmit(values: SessionReportFormValues) {
    createMutation.mutate(
      { ...values, sessionId },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  const lookupsLoading =
    shifts.isLoading || liveTypes.isLoading || teams.isLoading || channels.isLoading

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Báo cáo kết thúc ca"
      description="Điền số liệu ca vừa live."
      contentClassName="sm:max-w-xl max-h-[90vh] overflow-y-auto"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="session-report-form"
            disabled={createMutation.isPending || lookupsLoading}
          >
            {createMutation.isPending ? "Đang lưu..." : "Lưu báo cáo"}
          </Button>
        </>
      }
    >
      <Form {...form}>
        {/* noValidate: ô số dùng type="number" (bước mặc định 1) nên trình duyệt tự chặn "4.5" giờ —
            để zod kiểm theo đúng luật BE. */}
        <form
          id="session-report-form"
          noValidate
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormDate control={form.control} name="liveDate" label="Ngày live" required />
          <StaffNameField
            control={form.control}
            names={staffNames.data?.names ?? []}
            loading={staffNames.isLoading}
          />
          <FormSelect
            control={form.control}
            name="shiftId"
            label="Ca live"
            placeholder="Chọn ca"
            options={shifts.options}
            required
          />
          <FormSelect
            control={form.control}
            name="liveTypeId"
            label="Phân loại live"
            placeholder="Chọn loại"
            options={liveTypes.options}
            required
          />
          <FormSelect
            control={form.control}
            name="teamId"
            label="Team"
            placeholder="Chọn team"
            options={teams.options}
            required
          />
          <FormSelect
            control={form.control}
            name="channelId"
            label="Kênh live"
            placeholder="Chọn kênh"
            options={channels.options}
            required
          />
          <FormInput
            control={form.control}
            name="totalHours"
            label="Tổng giờ live (giờ, vd 3.5)"
            type="number"
            required
          />
          <FormInput
            control={form.control}
            name="revenue"
            label="Doanh thu"
            type="number"
            required
          />
          <FormInput
            control={form.control}
            name="viewCount"
            label="Số view"
            type="number"
            required
          />
          <FormInput
            control={form.control}
            name="retentionRate"
            label="Tỷ lệ giữ chân (giây)"
            type="number"
            required
          />
          <FormInput
            control={form.control}
            name="orderCount"
            label="Tổng đơn đặt hàng"
            type="number"
            required
          />
          <FormInput
            control={form.control}
            name="impressionCount"
            label="Lượt hiển thị"
            type="number"
            required
          />
        </form>
      </Form>
    </FormDialog>
  )
}
