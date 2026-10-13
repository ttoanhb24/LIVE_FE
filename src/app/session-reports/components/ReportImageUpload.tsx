import { ImagePlus } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import { REPORT_IMAGE_ACCEPT, validateReportImageFile } from "../constants/report-image"

interface ReportImageUploadProps {
  /** Lỗi từ form cha, vd bấm Lưu khi chưa chọn ảnh. */
  error?: string | null
  disabled?: boolean
  onFileChange: (file: File | null) => void
}

/** Một ảnh chụp số liệu ca — bắt buộc khi nộp báo cáo kết thúc ca. */
export function ReportImageUpload({ error, disabled, onFileChange }: ReportImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile]
  )

  useEffect(() => {
    if (!previewUrl) return
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  function selectFile(file: File | null) {
    const validationError = file ? validateReportImageFile(file) : null
    const accepted = validationError ? null : file
    setSelectedFile(accepted)
    setFileError(validationError)
    onFileChange(accepted)
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    event.target.value = ""
    if (file) selectFile(file)
  }

  const shownError = fileError ?? (selectedFile ? null : error)

  return (
    <div className="space-y-2 sm:col-span-2">
      <Label>
        Ảnh báo cáo
        <span className="text-destructive">*</span>
      </Label>
      <div className="flex flex-wrap items-start gap-4">
        <button
          type="button"
          aria-label="Chọn ảnh báo cáo"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex h-24 w-24 items-center justify-center overflow-hidden rounded-md border bg-muted/30",
            !previewUrl && "border-dashed",
            shownError && "border-destructive"
          )}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Xem trước ảnh báo cáo"
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
          )}
        </button>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={REPORT_IMAGE_ACCEPT}
            className="hidden"
            disabled={disabled}
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            {selectedFile ? "Đổi ảnh" : "Chọn ảnh"}
          </Button>
          {selectedFile ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={() => selectFile(null)}
            >
              Bỏ ảnh
            </Button>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Ảnh chụp màn hình số liệu ca (doanh thu, view, đơn). JPG, PNG hoặc WEBP — tối đa 10MB.
          </p>
        </div>
      </div>

      {shownError ? <p className="text-sm text-destructive">{shownError}</p> : null}
    </div>
  )
}
