/**
 * Lấy ảnh từ các cách người dùng hay thêm ảnh: dán (Ctrl+V / ⌘V) và kéo-thả. Viết dạng hàm thuần,
 * nhận "giống" ClipboardEvent/DragEvent của trình duyệt, để test được không cần DOM.
 */

interface ClipboardItemLike {
  kind: string
  type: string
  getAsFile(): File | null
}

interface ClipboardDataLike {
  types?: readonly string[]
  items?: ArrayLike<ClipboardItemLike>
  files?: ArrayLike<File>
}

interface DataTransferLike {
  types?: readonly string[]
  files?: ArrayLike<File>
}

interface ElementLike {
  tagName?: string
  type?: string
  isContentEditable?: boolean
}

const TEXT_INPUT_TYPES = new Set(["text", "number", "search", "email", "tel", "url", "password"])

/** Con trỏ đang ở một ô gõ chữ/số (input, textarea, vùng sửa được). */
export function isTextField(target: EventTarget | ElementLike | null): boolean {
  const el = target as ElementLike | null
  if (!el?.tagName) return false
  if (el.isContentEditable) return true
  const tag = el.tagName.toUpperCase()
  if (tag === "TEXTAREA") return true
  return tag === "INPUT" && TEXT_INPUT_TYPES.has((el.type ?? "text").toLowerCase())
}

/**
 * Ảnh trong lần dán: ảnh chụp màn hình vào bộ nhớ tạm (Win+Shift+S, ⌘+Ctrl+Shift+4), ảnh
 * "Sao chép hình ảnh" từ web/Zalo, hoặc file ảnh copy trong Finder/Explorer.
 *
 * Đang dán vào ô số/chữ mà bộ nhớ tạm CÓ chữ thì để trình duyệt dán chữ: copy ô từ Excel/Sheets
 * mang theo cả ảnh của vùng ô — cướp lần dán đó là người dùng mất số vừa copy.
 */
export function imageFromClipboard(
  data: ClipboardDataLike | null,
  pastingIntoTextField: boolean
): File | null {
  if (!data) return null
  const types = Array.from(data.types ?? [])
  const hasText = types.includes("text/plain") || types.includes("text/html")
  if (pastingIntoTextField && hasText) return null

  for (const item of Array.from(data.items ?? [])) {
    if (item.kind === "file" && item.type.startsWith("image/")) {
      const file = item.getAsFile()
      if (file) return file
    }
  }
  for (const file of Array.from(data.files ?? [])) {
    if (file.type.startsWith("image/")) return file
  }
  return null
}

/** Đang kéo file (không phải kéo chữ/link) — mới cần chặn trình duyệt mở file và tô sáng ô ảnh. */
export function isDraggingFiles(data: DataTransferLike | null): boolean {
  return Array.from(data?.types ?? []).includes("Files")
}

/** File đầu tiên được thả. Không lọc loại ở đây: thả PDF thì để bước kiểm báo "phải là JPG…". */
export function fileFromDrop(data: DataTransferLike | null): File | null {
  return Array.from(data?.files ?? [])[0] ?? null
}
