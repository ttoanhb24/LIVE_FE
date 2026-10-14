import type { SessionReportFormValues } from "../schemas/session-report-form.schema"
import type {
  CreateSessionReportPayload,
  CreateSessionReportResponse,
  ReportImageUploadResponse,
} from "../types/session-report"

export interface SubmitSessionReportInput {
  values: SessionReportFormValues
  sessionId: string
  imageFile: File
}

interface SubmitDeps {
  uploadImage: (file: File) => Promise<ReportImageUploadResponse>
  createReport: (payload: CreateSessionReportPayload) => Promise<CreateSessionReportResponse>
}

/**
 * Tải ảnh lên trước rồi mới nộp báo cáo kèm link ảnh. Tải ảnh lỗi thì dừng — không có báo cáo
 * nào được lưu thiếu ảnh. Báo cáo lỗi (vd nộp trùng) thì ảnh đã tải vẫn nằm trên Cloudinary.
 */
export async function submitSessionReport(
  { values, sessionId, imageFile }: SubmitSessionReportInput,
  { uploadImage, createReport }: SubmitDeps
): Promise<CreateSessionReportResponse> {
  const { imageUrl } = await uploadImage(imageFile)
  return createReport({ ...values, sessionId, imageUrl })
}
