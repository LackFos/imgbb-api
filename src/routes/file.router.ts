import { Router } from "express";
import { getFile, uploadFile } from "@/controllers/files/file-controller";
import { Multer } from "@/middlewares/multer";
import { zodValidator } from "@/middlewares/zod-validator";
import { fileGetRequestParamDTO } from "@/schemas/requests/files/file-get-request-param-dto";
import { fileUploadRequestBodyDTO } from "@/schemas/requests/files/file-upload-request-body-dto";

export const fileRouter = Router();

fileRouter.get(
  "/:path",
  zodValidator(fileGetRequestParamDTO, "params"),
  getFile,
);

fileRouter.post(
  "/upload",
  Multer.single("image"),
  zodValidator(fileUploadRequestBodyDTO, "body"),
  uploadFile,
);
