import type { MulterFile } from "@/schemas/multer-file-schema";
import axios from "axios";

export const imgbbService = {
  uploadImage,
};

interface ImgBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
    success: boolean;
    status: number;
    message: string;
  };
}

async function uploadImage(file: MulterFile): Promise<ImgBBResponse> {
  const apiKey = process.env.IMGBB_API_KEY;

  const formData = new FormData();
  const uint8Array = new Uint8Array(file.buffer);
  const blob = new Blob([uint8Array], { type: file.mimetype });

  formData.append("image", blob, file.originalname);

  const response = await axios.post<ImgBBResponse>(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    formData,
  );

  return response.data;
}
