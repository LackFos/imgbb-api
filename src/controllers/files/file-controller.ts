import { ReturnResponse } from "@/libs/response";
import type { FileUploadDTO } from "@/schemas/requests/file-upload-request";
import { imgbbService } from "@/services/imgbb-service";
import type { Request, Response } from "express";

export async function uploadFile(req: Request, res: Response) {
  try {
    const payload: FileUploadDTO = req.body;

    const response = await imgbbService.uploadImage(payload.image);

    return ReturnResponse.Created({
      response: res,
      message: "Image uploaded successfully",
      data: response.data,
    });
  } catch (error) {
    return ReturnResponse.InternalServerError({
      response: res,
      error,
    });
  }
}
