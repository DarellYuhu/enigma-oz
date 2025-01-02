import { z } from 'zod';

export const facebookGraphResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      title: z.string().optional(),
      name: z.string(),
      description: z.string(),
      period: z.string(),
      values: z.array(
        z.object({
          value: z.union([z.number(), z.record(z.string(), z.number())]),
          end_time: z.string().optional(),
        }),
      ),
    }),
  ),
  paging: z
    .object({
      next: z.string(),
      previous: z.string(),
    })
    .optional(),
});

export type FacebookGraphResponseSchema = z.infer<
  typeof facebookGraphResponseSchema
>;
