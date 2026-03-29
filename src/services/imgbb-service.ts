import type { MulterFileDTO } from "@/schemas/multer-file-dto";
import {
  storedImageDTO,
  type StoredImageDTO,
} from "@/schemas/stored-image-dto";
import axios from "axios";

export const imgbbService = {
  uploadImage,
};

interface ImgbbUploadResponse {
  data: StoredImageDTO;
}

async function uploadImage(file: MulterFileDTO): Promise<StoredImageDTO> {
  const apiKey = process.env.IMGBB_API_KEY;

  const formData = new FormData();
  const uint8Array = new Uint8Array(file.buffer);
  const blob = new Blob([uint8Array], { type: file.mimetype });

  formData.append("image", blob, file.originalname);

  const response = await axios.post<{ data: ImgbbUploadResponse }>(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    formData,
  );

  return storedImageDTO.parse(response.data.data);
}
