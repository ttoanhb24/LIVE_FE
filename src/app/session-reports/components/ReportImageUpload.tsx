import { ImagePlus, Loader2 } from "lucide-react"
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import { REPORT_IMAGE_ACCEPT } from "../constants/report-image"
import { prepareReportImage } from "../utils/prepare-report-image"
import {
  fileFromDrop,
  imageFromClipboard,
  isDraggingFiles,
  isTextField,
} from "../utils/report-image-input"

interface ReportImageUploadProps {
  /** Lỗi từ form cha, vd bấm Lưu khi chưa chọn ảnh. */
  error?: string | null
  disabled?: boolean
  onFileChange: (file: File | null) => void
}

/**
 * Một ảnh chụp số liệu ca — bắt buộc khi nộp báo cáo kết thúc ca. Thêm ảnh được bằng: dán
 * (Ctrl+V / ⌘V) ở bất kỳ đâu trong form, kéo-thả file, hoặc bấm chọn (điện thoại: chụp / thư viện).
 * Ô này chỉ tồn tại khi form đang mở, nên lắng nghe dán/thả trên cả trang là đủ phạm vi.
 */
export function ReportImageUpload({ error, disabled, onFileChange }: ReportImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  /** Mỗi lần thêm ảnh tăng số này — ảnh nén xong muộn mà đã có ảnh mới thì bỏ kết quả cũ. */
  const latestPick = useRef(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  /** Đếm dragenter/dragleave lồng nhau qua các phần tử con — > 0 là đang kéo file trên trang. */
  const [dragDepth, setDragDepth] = useState(0)

  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile]
  )

  useEffect(() => {
    if (!previewUrl) return
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  async function acceptFile(file: File) {
    const pick = ++latestPick.current
    setProcessing(true)
    const prepared = await prepareReportImage(file)
    if (pick !== latestPick.current) return
    setProcessing(false)
    setSelectedFile(prepared.file)
    setFileError(prepared.error)
    onFileChange(prepared.file)
  }

  function clearFile() {
    latestPick.current += 1
    setProcessing(false)
    setSelectedFile(null)
    setFileError(null)
    onFileChange(null)
  }

  function openPicker() {
    inputRef.current?.click()
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    event.target.value = ""
    if (file) void acceptFile(file)
  }

  const onPaste = useEffectEvent((event: ClipboardEvent) => {
    if (disabled) return
    const file = imageFromClipboard(event.clipboardData, isTextField(event.target))
    if (!file) return
    event.preventDefault()
    void acceptFile(file)
  })

  const onDragEnter = useEffectEvent((event: DragEvent) => {
    if (isDraggingFiles(event.dataTransfer)) setDragDepth((depth) => depth + 1)
  })

  const onDragLeave = useEffectEvent((event: DragEvent) => {
    if (isDraggingFiles(event.dataTransfer)) setDragDepth((depth) => Math.max(0, depth - 1))
  })

  // Thả file ở đâu trong trang cũng nhận, và chặn trình duyệt mở file thay trang (mất form).
  const onDragOver = useEffectEvent((event: DragEvent) => {
    if (isDraggingFiles(event.dataTransfer)) event.preventDefault()
  })

  const onDrop = useEffectEvent((event: DragEvent) => {
    if (!isDraggingFiles(event.dataTransfer)) return
    event.preventDefault()
    setDragDepth(0)
    if (disabled) return
    const file = fileFromDrop(event.dataTransfer)
    if (file) void acceptFile(file)
  })

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => onPaste(event)
    const handleDragEnter = (event: DragEvent) => onDragEnter(event)
    const handleDragLeave = (event: DragEvent) => onDragLeave(event)
    const handleDragOver = (event: DragEvent) => onDragOver(event)
    const handleDrop = (event: DragEvent) => onDrop(event)

    document.addEventListener("paste", handlePaste)
    document.addEventListener("dragenter", handleDragEnter)
    document.addEventListener("dragleave", handleDragLeave)
    document.addEventListener("dragover", handleDragOver)
    document.addEventListener("drop", handleDrop)
    return () => {
      document.removeEventListener("paste", handlePaste)
      document.removeEventListener("dragenter", handleDragEnter)
      document.removeEventListener("dragleave", handleDragLeave)
      document.removeEventListener("dragover", handleDragOver)
      document.removeEventListener("drop", handleDrop)
    }
  }, [])

  const dragging = dragDepth > 0
  const shownError = fileError ?? (selectedFile ? null : error)

  return (
    <div className="space-y-2 sm:col-span-2">
      <Label>
        Ảnh báo cáo
        <span className="text-destructive">*</span>
      </Label>

      <div
        className={cn(
          "flex flex-wrap items-center gap-4 rounded-md border border-dashed p-3 transition-colors",
          dragging && "border-primary bg-primary/5",
          !dragging && shownError && "border-destructive"
        )}
      >
        <button
          type="button"
          aria-label={selectedFile ? "Đổi ảnh báo cáo" : "Chọn ảnh báo cáo"}
          disabled={disabled || processing}
          onClick={openPicker}
          className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/30"
        >
          {processing ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : previewUrl ? (
            <img src={previewUrl} alt="Xem trước ảnh báo cáo" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
          )}
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {dragging ? (
            <p className="text-sm font-medium text-primary">Thả ảnh vào đây</p>
          ) : processing ? (
            <p className="text-sm text-muted-foreground">Đang xử lý ảnh...</p>
          ) : (
            <p className="text-sm">
              <span className="font-medium">Dán ảnh (Ctrl+V / ⌘V)</span>, kéo thả vào đây, hoặc{" "}
              <button
                type="button"
                disabled={disabled}
                onClick={openPicker}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                chọn từ máy
              </button>
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Chụp màn hình vào bộ nhớ tạm: Windows Win + Shift + S · Mac ⌘ + Ctrl + Shift + 4, rồi
            dán vào form. Điện thoại: bấm ô ảnh để chụp hoặc chọn từ thư viện.
          </p>
          <p className="text-xs text-muted-foreground">JPG, PNG, WEBP — ảnh trên 10MB tự nén.</p>
          {selectedFile ? (
            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={openPicker}>
                Đổi ảnh
              </Button>
              <Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={clearFile}>
                Bỏ ảnh
              </Button>
            </div>
          ) : null}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={REPORT_IMAGE_ACCEPT}
          className="hidden"
          disabled={disabled}
          onChange={handleFileChange}
        />
      </div>

      {shownError ? <p className="text-sm text-destructive">{shownError}</p> : null}
    </div>
  )
}
