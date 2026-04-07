import { ApiKeyRotator } from "@/libs/api-key-rotator";
import { RedisClient } from "@/libs/redis-client";
import type { MulterFileDTO } from "@/schemas/multer-file-dto";
import {
  storedImageDTO,
  type StoredImageDTO,
} from "@/schemas/stored-image-dto";
import axios, { AxiosError } from "axios";

export const imgbbService = {
  uploadImage,
};

interface ImgbbUploadResponse {
  data: StoredImageDTO;
}

async function uploadImage(file: MulterFileDTO): Promise<StoredImageDTO> {
  const formData = new FormData();
  const uint8Array = new Uint8Array(file.buffer);
  const blob = new Blob([uint8Array], { type: file.mimetype });

  formData.append("image", blob, file.originalname);

  const redisClient = await RedisClient();
  const apiKeyRotator = new ApiKeyRotator(redisClient);

  const response = await uploadImageWithRotatingKeys(formData, apiKeyRotator);

  apiKeyRotator.incrementUsageCount();

  return response;
}

async function uploadImageWithRotatingKeys(
  formData: FormData,
  apiKeyRotator: ApiKeyRotator,
  maxRetries: number = 3,
): Promise<StoredImageDTO> {
  let retryCount = 0;
  let lastError: unknown = null;

  while (retryCount <= maxRetries) {
    try {
      const apiKey = await apiKeyRotator.getCurrentApiKey();

      if (!apiKey) {
        throw new Error("No API key found");
      }

      const response = await axios.post<{ data: ImgbbUploadResponse }>(
        `https://api.imgbb.com/1/upload?key=${apiKey.key}`,
        formData,
      );

      return storedImageDTO.parse(response.data.data);
    } catch (error) {
      lastError = error;

      if (
        error instanceof AxiosError &&
        error.response?.data.error.message === "Rate limit reached."
      ) {
        await apiKeyRotator.rotateApiKey();
        retryCount++;
      } else {
        throw error;
      }
    }
  }

  throw lastError;
}
