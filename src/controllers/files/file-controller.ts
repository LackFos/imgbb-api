import { lmdbConnection } from "@/index";
import { ReturnResponse } from "@/libs/response";
import type { FileUploadDTO } from "@/schemas/requests/files/file-upload-request";
import type { StoredImage } from "@/services/imgbb-service";
import { imgbbService } from "@/services/imgbb-service";
import type { Request, Response } from "express";
import { lmdbService } from "@/services/lmdb-service";
import type { FileGetDTO } from "@/schemas/requests/files/file-get-request";

export function getFile(
  req: Request<FileGetDTO, unknown, unknown>,
  res: Response,
) {
  try {
    const { slug } = req.params;

    const file = lmdbService(lmdbConnection).get<StoredImage>(slug);

    if (!file) {
      return ReturnResponse.NotFound({
        response: res,
        message: "File not found",
      });
    }

    return ReturnResponse.Success({
      response: res,
      data: file,
    });
  } catch (error) {
    return ReturnResponse.InternalServerError({ response: res, error });
  }
}

export async function uploadFile(
  req: Request<Record<string, string>, unknown, FileUploadDTO>,
  res: Response,
) {
  try {
    const { slug, image } = req.body;

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
