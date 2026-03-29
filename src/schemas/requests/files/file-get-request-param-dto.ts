import { z } from "zod";

export const fileGetRequestParamDTO = z.object({
  path: z
    .string("The slug field is required")
    .min(1, "The slug field is required"),
});

export type FileGetRequestParamDTO = z.infer<typeof fileGetRequestParamDTO>;
