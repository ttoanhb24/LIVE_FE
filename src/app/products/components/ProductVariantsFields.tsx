import { Plus, Trash2 } from "lucide-react"
import type { Control, FieldValues, UseFormReturn } from "react-hook-form"
import { useFieldArray } from "react-hook-form"

import { FormInput } from "@/components/FieldCustom/FormInput"
import { Button } from "@/components/ui/button"

interface ProductVariantsFieldsProps<T extends FieldValues> {
  form: UseFormReturn<T>
  disabled?: boolean
}

export function ProductVariantsFields<T extends FieldValues>({
  form,
  disabled,
}: ProductVariantsFieldsProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants" as never,
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Biến thể</p>
          <p className="text-sm text-muted-foreground">
            SKU, giá và tồn kho theo size/màu.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() =>
            append({
              sku: "",
              name: "",
              price: "",
              stock: 0,
            } as never)
          }
        >
          <Plus className="h-4 w-4" />
          Thêm biến thể
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
          Chưa có biến thể. Sản phẩm vẫn tạo được — thêm SKU sau cũng được.
        </p>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_auto]"
            >
              <FormInput
                control={form.control as Control<T>}
                name={`variants.${index}.sku` as never}
                label={index === 0 ? "SKU" : ""}
                placeholder="SP001-S"
                disabled={disabled}
                required
              />
              <FormInput
                control={form.control as Control<T>}
                name={`variants.${index}.name` as never}
                label={index === 0 ? "Tên biến thể" : ""}
                placeholder="Size S"
                disabled={disabled}
              />
              <FormInput
                control={form.control as Control<T>}
                name={`variants.${index}.price` as never}
                label={index === 0 ? "Giá" : ""}
                type="number"
                placeholder="1000000"
                disabled={disabled}
              />
              <FormInput
                control={form.control as Control<T>}
                name={`variants.${index}.stock` as never}
                label={index === 0 ? "Tồn" : ""}
                type="number"
                disabled={disabled}
              />
              <div className={index === 0 ? "pt-8" : "flex items-center"}>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Xóa biến thể"
                  disabled={disabled}
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
