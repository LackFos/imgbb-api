import { z } from "zod";

export const fileGetRequest = z.object({
  slug: z
    .string("The slug field is required")
    .min(1, "The slug field is required"),
});

export type FileGetDTO = z.infer<typeof fileGetRequest>;
