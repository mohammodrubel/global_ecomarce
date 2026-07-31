import { z } from "zod";
export const ProductControllerValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'product color is required' }),
  }),
});

