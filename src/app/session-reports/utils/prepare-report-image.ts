import {
  REPORT_IMAGE_ACCEPT,
  REPORT_IMAGE_MAX_BYTES,
  validateReportImageFile,
} from "../constants/report-image"

/** Cạnh dài tối đa sau khi nén — 2560px vẫn đọc rõ số liệu trên ảnh chụp màn hình. */
const SHRINK_MAX_EDGE = 2560
const SHRINK_QUALITY = 0.9

export type PreparedReportImage = { file: File; error: null } | { file: null; error: string }

/**
 * Nén ảnh quá nặng thành JPEG (thường là ảnh chụp màn hình PNG trên màn Retina/4K, dễ vượt 10MB).
 * Chỉ chạy trên trình duyệt (canvas).
 */
export async function shrinkImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, SHRINK_MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", SHRINK_QUALITY)
  )
  if (!blob) return file
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "anh-bao-cao"}.jpg`, {
    type: "image/jpeg",
  })
}

/**
 * Ảnh vừa dán/thả/chọn → ảnh sẵn sàng tải lên. Sai loại thì báo ngay; quá 10MB thì nén thử
 * trước khi báo lỗi, để người dùng không phải tự đi nén ảnh chụp màn hình.
 */
export async function prepareReportImage(
  file: File,
  shrink: (file: File) => Promise<File> = shrinkImage
): Promise<PreparedReportImage> {
  const error = validateReportImageFile(file)
  if (!error) return { file, error: null }
  const oversizedImage =
    REPORT_IMAGE_ACCEPT.split(",").includes(file.type) && file.size > REPORT_IMAGE_MAX_BYTES
  if (!oversizedImage) return { file: null, error }

  // Đúng loại ảnh, chỉ quá nặng — thử nén.
  try {
    const smaller = await shrink(file)
    const smallerError = validateReportImageFile(smaller)
    return smallerError ? { file: null, error: smallerError } : { file: smaller, error: null }
  } catch {
    return { file: null, error }
  }
}
