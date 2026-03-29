import { z } from "zod";

const imageDetailSchema = z
  .object({
    filename: z.string(),
    name: z.string(),
    mime: z.string(),
    extension: z.string(),
    url: z.string(),
  })
  .optional();

export const storedImageDTO = z.object({
  id: z.string(),
  title: z.string(),
  url_viewer: z.string(),
  url: z.string(),
  display_url: z.string(),
  width: z.number(),
  height: z.number(),
  size: z.number(),
  time: z.number(),
  expiration: z.number(),
  image: imageDetailSchema,
  thumb: imageDetailSchema,
  medium: imageDetailSchema,
  delete_url: z.string(),
});

export type StoredImageDTO = z.infer<typeof storedImageDTO>;
