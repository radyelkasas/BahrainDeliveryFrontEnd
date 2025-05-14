import { z } from 'zod';

// Login form validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'validation.email.required' })
    .email({ message: 'validation.email.invalid' }),
  password: z
    .string()
    .min(1, { message: 'validation.password.required' })
    .min(8, { message: 'validation.password.min' }),
  remember: z.boolean().optional()
});

// Registration form validation schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'validation.name.required' })
    .min(3, { message: 'validation.name.min' }),
  email: z
    .string()
    .min(1, { message: 'validation.email.required' })
    .email({ message: 'validation.email.invalid' }),
  phone: z
    .string()
    .min(1, { message: 'validation.phone.required' })
    .regex(/^\+?[0-9]{8,15}$/, { message: 'validation.phone.invalid' }),
  address: z
    .string()
    .min(1, { message: 'validation.address.required' })
    .min(5, { message: 'validation.address.min' }),
  password: z
    .string()
    .min(1, { message: 'validation.password.required' })
    .min(8, { message: 'validation.password.min' }),
  isActive: z.boolean().default(true),
  role: z.string().default('user')
});

// Update profile form validation schema
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'validation.name.required' })
    .min(3, { message: 'validation.name.min' }),
  email: z
    .string()
    .min(1, { message: 'validation.email.required' })
    .email({ message: 'validation.email.invalid' }),
  phone: z
    .string()
    .min(1, { message: 'validation.phone.required' })
    .regex(/^\+?[0-9]{8,15}$/, { message: 'validation.phone.invalid' }),
  address: z
    .string()
    .min(1, { message: 'validation.address.required' })
    .min(5, { message: 'validation.address.min' })
});

// Update password form validation schema
export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'validation.currentPassword.required' })
      .min(8, { message: 'validation.currentPassword.min' }),
    newPassword: z
      .string()
      .min(1, { message: 'validation.newPassword.required' })
      .min(8, { message: 'validation.newPassword.min' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'validation.confirmPassword.required' })
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'validation.confirmPassword.match',
    path: ['confirmPassword']
  });

// Forgot password form validation schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'validation.email.required' })
    .email({ message: 'validation.email.invalid' })
});

// Reset password form validation schema
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: 'validation.password.required' })
      .min(8, { message: 'validation.password.min' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'validation.confirmPassword.required' })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'validation.confirmPassword.match',
    path: ['confirmPassword']
  });
