import { z } from "zod";

// Category validation schema for creating new categories
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "validation.name.required" })
    .min(2, { message: "validation.name.min" }),
  description: z
    .string()
    .min(1, { message: "validation.description.required" })
    .min(5, { message: "validation.description.min" }),
  image: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        if (files[0] === undefined) return true;
        return [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "image/gif",
        ].includes(files[0]?.type);
      },
      { message: "validation.image.format" }
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        if (files[0] === undefined) return true;
        return files[0]?.size <= 5242880; // 5MB
      },
      { message: "validation.image.size" }
    ),
  isActive: z.boolean().default(true),
});

// Category validation schema for updating categories (image is optional)
export const categoryUpdateSchema = categorySchema.extend({
  image: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        if (files[0] === undefined) return true;
        return [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "image/gif",
        ].includes(files[0]?.type);
      },
      { message: "validation.image.format" }
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        if (files[0] === undefined) return true;
        return files[0]?.size <= 5242880; // 5MB
      },
      { message: "validation.image.size" }
    ),
});

// Category status validation schema
export const categoryStatusSchema = z.object({
  isActive: z.boolean(),
});

export default {
  categorySchema,
  categoryUpdateSchema,
  categoryStatusSchema,
};
