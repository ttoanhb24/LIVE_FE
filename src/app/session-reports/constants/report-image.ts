/** Khớp `LIVE_BE/src/session-reports/session-report-image.constants.ts`. */
export const REPORT_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp"
export const REPORT_IMAGE_MAX_BYTES = 10 * 1024 * 1024

function isHeic(file: File): boolean {
  return /image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name)
}

/** Ảnh báo cáo là bắt buộc: chưa chọn, sai loại hay quá nặng đều trả câu lỗi để hiện dưới ô ảnh. */
export function validateReportImageFile(file: File | null): string | null {
  if (!file) return "Chọn ảnh báo cáo"
  if (isHeic(file)) {
    // Ảnh iPhone gửi qua AirDrop/Zalo PC: trình duyệt (trừ Safari) không đọc được HEIC.
    return "Ảnh HEIC của iPhone chưa đọc được — mở ảnh rồi chụp màn hình và dán vào, hoặc chọn ảnh từ điện thoại"
  }
  if (!REPORT_IMAGE_ACCEPT.split(",").includes(file.type)) {
    return "Ảnh phải là JPG, PNG hoặc WEBP"
  }
  if (file.size > REPORT_IMAGE_MAX_BYTES) {
    return "Ảnh không được lớn hơn 10MB"
  }
  return null
}
