import { z } from "zod"

import { BLOCK_GROUP_TYPES } from "../constants/block-type"

const codeSchema = z
  .string()
  .trim()
  .min(1, "Mã nhóm không được để trống")
  .max(50, "Mã nhóm tối đa 50 ký tự")
  .regex(/^[A-Z0-9_]+$/, "Mã chỉ gồm chữ in hoa, số và dấu gạch dưới")

const nameSchema = z
  .string()
  .trim()
  .min(1, "Tên nhóm không được để trống")
  .max(100, "Tên nhóm tối đa 100 ký tự")

const weightSchema = z.coerce
  .number()
  .int("Trọng số phải là số nguyên")
  .min(1, "Trọng số phải >= 1")

const sortOrderSchema = z.coerce
  .number()
  .int("Thứ tự phải là số nguyên")
  .min(0, "Thứ tự phải >= 0")

const pickCountSchema = z.coerce
  .number()
  .int("Số lượng chọn phải là số nguyên")
  .min(0, "Số lượng chọn phải >= 0")

export const createBlockGroupSchema = z.object({
  type: z.enum(BLOCK_GROUP_TYPES, {
    message: "Nhóm CTA chỉ dành cho loại Kêu gọi hành động",
  }),
  code: codeSchema,
  name: nameSchema,
  weight: weightSchema,
  sortOrder: sortOrderSchema,
  pickCount: pickCountSchema,
  isActive: z.boolean(),
})

export const updateBlockGroupSchema = z.object({
  name: nameSchema,
  weight: weightSchema,
  sortOrder: sortOrderSchema,
  pickCount: pickCountSchema,
  isActive: z.boolean(),
})

export type CreateBlockGroupFormInput = z.input<typeof createBlockGroupSchema>
export type CreateBlockGroupFormValues = z.output<typeof createBlockGroupSchema>
export type UpdateBlockGroupFormInput = z.input<typeof updateBlockGroupSchema>
export type UpdateBlockGroupFormValues = z.output<typeof updateBlockGroupSchema>

export const createBlockGroupDefaultValues: CreateBlockGroupFormInput = {
  type: "CTA",
  code: "",
  name: "",
  weight: 1,
  sortOrder: 0,
  pickCount: 1,
  isActive: true,
}

export const updateBlockGroupDefaultValues: UpdateBlockGroupFormInput = {
  name: "",
  weight: 1,
  sortOrder: 0,
  pickCount: 1,
  isActive: true,
}
