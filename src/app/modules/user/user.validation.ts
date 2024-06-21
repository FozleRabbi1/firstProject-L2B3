import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'password must be string',
    })
    .min(5, { message: 'minmum 5 characters you have need' })
    .max(10, { message: 'max 10 characters you have need' })
    .optional(),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['in-progress', 'blocked']),
  }),
});

export const UserValidation = {
  userValidationSchema,
  changeStatusValidationSchema,
};
