import type { FileUploadRequestBodyDTO } from "@/schemas/requests/files/file-upload-request-body-dto";
import { lmdbConnection } from "@/index";
import { ReturnResponse } from "@/libs/response";
import { imgbbService } from "@/services/imgbb-service";
import type { Request, Response } from "express";
import { lmdbService } from "@/services/lmdb-service";
import type { FileGetRequestParamDTO } from "@/schemas/requests/files/file-get-request-param-dto";

export function getFile(
  req: Request<FileGetRequestParamDTO, unknown, unknown>,
  res: Response,
) {
  try {
    const { path } = req.params;

    const file = lmdbService(lmdbConnection).get(path);

    if (!file) {
      return ReturnResponse.NotFound({
        response: res,
        message: "File not found",
      });
    }

    res.setHeader("X-Actual-URL", file?.image?.url || "");

    return ReturnResponse.Success({
      response: res,
      data: file,
    });
  } catch (error) {
    return ReturnResponse.InternalServerError({ response: res, error });
  }
}

export async function uploadFile(
  req: Request<Record<string, string>, unknown, FileUploadRequestBodyDTO>,
  res: Response,
) {
  try {
    const { slug, image } = req.body;

    const storedImage = await imgbbService.uploadImage(image);
    lmdbService(lmdbConnection).put(slug, storedImage);

    return ReturnResponse.Created({
      response: res,
      message: "Image uploaded successfully",
      data: storedImage,
    });
  } catch (error) {
    return ReturnResponse.InternalServerError({ response: res, error });
  }
}
