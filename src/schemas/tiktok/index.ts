import { z } from "zod";

const create = z.object({
  projectName: z.string().trim().min(1, "Required"),
  keywords: z
    .string()
    .trim()
    .min(1, "Required")
    .refine((val) => val.split(",").length > 0, {
      message: "Keywords must be separated by comma",
    }),
});

const update = z.object({
  projectId: z.string().optional(),
  keywords: z.string().trim().min(1, "Required").optional(),
  status: z.boolean().optional(),

  // added for accessibility only
  currentKeywords: z.string().optional(),
});

const TiktokSchema = { create, update };

export default TiktokSchema;
