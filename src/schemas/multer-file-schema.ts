import z from "zod";

export const MulterFileSchema = (message = "The file field is required") =>
  z.object(
    {
      fieldname: z.string(),
      originalname: z.string(),
      encoding: z.string(),
      mimetype: z.string(),
      buffer: z.instanceof(Buffer),
      size: z.number(),
    },
    message,
  );

export type MulterFile = z.infer<ReturnType<typeof MulterFileSchema>>;
