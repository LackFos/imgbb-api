import { z } from "zod";
import { multerFileDTO } from "@/schemas/multer-file-dto";

export const fileUploadRequestBodyDTO = z.object({
  slug: z
    .string("The slug field is required")
    .min(1, "The slug field is required"),
  image: multerFileDTO(),
});

export type FileUploadRequestBodyDTO = z.infer<typeof fileUploadRequestBodyDTO>;
