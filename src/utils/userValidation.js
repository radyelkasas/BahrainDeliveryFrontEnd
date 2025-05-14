import { z } from "zod";

// User validation schema for creating/editing users
export const userSchema = z.object({
  name: z
    .string()
    .min(1, { message: "validation.name.required" })
    .min(3, { message: "validation.name.min" }),
  email: z
    .string()
    .min(1, { message: "validation.email.required" })
    .email({ message: "validation.email.invalid" }),
  phone: z
    .string()
    .min(1, { message: "validation.phone.required" })
    .regex(/^\+?[0-9]{8,15}$/, { message: "validation.phone.invalid" }),
  address: z
    .string()
    .min(1, { message: "validation.address.required" })
    .min(5, { message: "validation.address.min" }),
  password: z
    .string()
    .min(1, { message: "validation.password.required" })
    .min(8, { message: "validation.password.min" }),
  role: z.string().min(1, { message: "validation.role.required" }),
  isActive: z.boolean().default(true),
});

// User validation schema for updating users (password is optional)
export const userUpdateSchema = userSchema.omit({ password: true }).extend({
  password: z
    .string()
    .min(8, { message: "validation.password.min" })
    .optional()
    .or(z.literal("")),
});

// User status validation schema
export const userStatusSchema = z.object({
  isActive: z.boolean(),
});
