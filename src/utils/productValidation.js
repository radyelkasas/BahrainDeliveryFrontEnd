import { z } from "zod";

// Product validation schema for creating new products
export const productSchema = z.object({
  name: z
    .string()
    .min(1, { message: "validation.name.required" })
    .min(2, { message: "validation.name.min" }),
  description: z
    .string()
    .min(1, { message: "validation.description.required" })
    .min(5, { message: "validation.description.min" }),
  price: z
    .string()
    .min(1, { message: "validation.price.required" })
    .refine(
      (value) => {
        const price = parseFloat(value);
        return !isNaN(price) && price > 0;
      },
      { message: "validation.price.positive" }
    ),
  stock: z
    .string()
    .min(1, { message: "validation.stock.required" })
    .refine(
      (value) => {
        const stock = parseInt(value, 10);
        return !isNaN(stock) && stock >= 0;
      },
      { message: "validation.stock.nonnegative" }
    ),
  category: z.string().min(1, { message: "validation.category.required" }),
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

// Product validation schema for updating products (all fields optional except id)
export const productUpdateSchema = productSchema.extend({
  name: z.string().min(2, { message: "validation.name.min" }).optional(),
  description: z
    .string()
    .min(5, { message: "validation.description.min" })
    .optional(),
  price: z
    .string()
    .refine(
      (value) => {
        if (!value) return true; // Skip validation if empty
        const price = parseFloat(value);
        return !isNaN(price) && price > 0;
      },
      { message: "validation.price.positive" }
    )
    .optional(),
  stock: z
    .string()
    .refine(
      (value) => {
        if (!value) return true; // Skip validation if empty
        const stock = parseInt(value, 10);
        return !isNaN(stock) && stock >= 0;
      },
      { message: "validation.stock.nonnegative" }
    )
    .optional(),
  category: z.string().optional(),
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

// Product status validation schema
export const productStatusSchema = z.object({
  isActive: z.boolean(),
});

// Product stock validation schema
export const productStockSchema = z.object({
  stock: z
    .number()
    .int()
    .nonnegative({ message: "validation.stock.nonnegative" }),
});

export default {
  productSchema,
  productUpdateSchema,
  productStatusSchema,
  productStockSchema,
};
