import { lmdbConnection } from "@/index";
import { ReturnResponse } from "@/libs/response";
import type { FileUploadDTO } from "@/schemas/requests/file-upload-request";
import { imgbbService } from "@/services/imgbb-service";
import type { Request, Response } from "express";
import { lmdbService } from "@/services/lmdb-service";

export async function uploadFile(req: Request, res: Response) {
  try {
    const { slug, image }: FileUploadDTO = req.body;

    const storedImage = await imgbbService.uploadImage(image);
    lmdbService(lmdbConnection).put(slug, storedImage);

    return ReturnResponse.Created({
      response: res,
      message: "Image uploaded successfully",
      data: storedImage.data,
    });
  } catch (error) {
    return ReturnResponse.InternalServerError({ response: res, error });
  }
}
