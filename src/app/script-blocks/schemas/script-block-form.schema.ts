import { z } from "zod"

import { SCRIPT_BLOCK_TYPES } from "@/app/block-groups/constants/block-type"

import {
  GROUP_REQUIRED_TYPES,
  PRODUCT_REQUIRED_TYPES,
} from "../types/script-block"

const baseFields = {
  title: z
    .string()
    .trim()
    .max(200, "Tiêu đề tối đa 200 ký tự")
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .trim()
    .min(1, "Nội dung không được để trống")
    .max(10000, "Nội dung tối đa 10000 ký tự"),
  durationSec: z.coerce
    .number()
    .int("Thời lượng phải là số nguyên")
    .min(1, "Thời lượng phải >= 1 giây"),
  weight: z.coerce
    .number()
    .int("Trọng số phải là số nguyên")
    .min(1, "Trọng số phải >= 1"),
  isActive: z.boolean(),
  emotionIds: z.array(z.string()).default([]),
}

function refineScope(
  data: {
    type: (typeof SCRIPT_BLOCK_TYPES)[number]
    groupId?: string
    productId?: string
  },
  ctx: z.RefinementCtx
) {
  if (PRODUCT_REQUIRED_TYPES.includes(data.type) && !data.productId?.trim()) {
    ctx.addIssue({
      code: "custom",
      message: "Câu chuyện và ý nghĩa phải chọn sản phẩm",
      path: ["productId"],
    })
  }

  if (GROUP_REQUIRED_TYPES.includes(data.type) && !data.groupId?.trim()) {
    ctx.addIssue({
      code: "custom",
      message: "CTA phải chọn nhóm CTA",
      path: ["groupId"],
    })
  }

  if (
    GROUP_REQUIRED_TYPES.includes(data.type) &&
    data.productId?.trim()
  ) {
    ctx.addIssue({
      code: "custom",
      message: "CTA không được gắn sản phẩm",
      path: ["productId"],
    })
  }

  if (
    !GROUP_REQUIRED_TYPES.includes(data.type) &&
    data.groupId?.trim()
  ) {
    ctx.addIssue({
      code: "custom",
      message: "Loại này không được gắn nhóm CTA",
      path: ["groupId"],
    })
  }
}

export const createScriptBlockSchema = z
  .object({
    type: z.enum(SCRIPT_BLOCK_TYPES, { message: "Vui lòng chọn loại block" }),
    groupId: z.string().optional().or(z.literal("")),
    productId: z.string().optional().or(z.literal("")),
    ...baseFields,
  })
  .superRefine(refineScope)

export const updateScriptBlockSchema = z.object({
  ...baseFields,
})

export type CreateScriptBlockFormInput = z.input<typeof createScriptBlockSchema>
export type CreateScriptBlockFormValues = z.output<typeof createScriptBlockSchema>
export type UpdateScriptBlockFormInput = z.input<typeof updateScriptBlockSchema>
export type UpdateScriptBlockFormValues = z.output<typeof updateScriptBlockSchema>

export const createScriptBlockDefaultValues: CreateScriptBlockFormInput = {
  type: "STORY",
  groupId: "",
  productId: "",
  title: "",
  content: "",
  durationSec: 60,
  weight: 1,
  isActive: true,
  emotionIds: [],
}

export const updateScriptBlockDefaultValues: UpdateScriptBlockFormInput = {
  title: "",
  content: "",
  durationSec: 60,
  weight: 1,
  isActive: true,
  emotionIds: [],
}

export function mapScriptBlockFormToCreatePayload(
  values: CreateScriptBlockFormValues
) {
  return {
    type: values.type,
    groupId: values.groupId?.trim() ? values.groupId.trim() : undefined,
    productId: values.productId?.trim() ? values.productId.trim() : undefined,
    title: values.title?.trim() ? values.title.trim() : undefined,
    content: values.content,
    durationSec: values.durationSec,
    weight: values.weight,
    isActive: values.isActive,
    emotionIds: values.emotionIds.length ? values.emotionIds : undefined,
  }
}

export function mapScriptBlockFormToUpdatePayload(
  values: UpdateScriptBlockFormValues
) {
  return {
    title: values.title?.trim() ? values.title.trim() : undefined,
    content: values.content,
    durationSec: values.durationSec,
    weight: values.weight,
    isActive: values.isActive,
    emotionIds: values.emotionIds,
  }
}

export function getContentPlaceholder(type: CreateScriptBlockFormValues["type"]) {
  switch (type) {
    case "PRODUCT_SPEC":
      return "VD: {{name}} — chất liệu {{material}}, size {{size}}..."
    case "MEANING":
      return "Fun fact / kiến thức thú vị về sản phẩm, host đọc nguyên văn trên live..."
    case "STORY":
      return "Câu chuyện cảm xúc gắn sản phẩm, host đọc nguyên văn trên live..."
    case "OPENING":
    case "CLOSING":
    case "CTA":
    case "GAME":
      return "Thẻ nhắc việc hiển thị trên màn hình live..."
    default:
      return "Văn nói đọc nguyên văn khi live..."
  }
}
