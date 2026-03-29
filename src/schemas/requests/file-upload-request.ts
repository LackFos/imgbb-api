import { z } from "zod";
import { MulterFileSchema } from "@/schemas/multer-file-schema";

export const fileUploadRequest = z.object({
  image: MulterFileSchema(),
});

export type FileUploadDTO = z.infer<typeof fileUploadRequest>;
