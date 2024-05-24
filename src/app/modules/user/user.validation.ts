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

export const UserValidation = {
  userValidationSchema,
};
