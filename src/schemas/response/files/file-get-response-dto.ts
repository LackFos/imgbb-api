import { storedImageDTO } from "@/schemas/stored-image-dto";
import type { z } from "zod";

export const fileGetResponseDTO = storedImageDTO;
export type FileGetResponseDTO = z.infer<typeof fileGetResponseDTO>;
