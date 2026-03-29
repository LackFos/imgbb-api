import { z } from "zod";
import { MulterFileSchema } from "@/schemas/multer-file-schema";

export const fileUploadRequest = z.object({
  slug: z
    .string("The slug field is required")
    .min(1, "The slug field is required"),
  image: MulterFileSchema(),
});

export type FileUploadDTO = z.infer<typeof fileUploadRequest>;
