import { Router } from "express";
import { getFile, uploadFile } from "@/controllers/files/file-controller";
import { Multer } from "@/middlewares/multer";
import { zodValidator } from "@/middlewares/zod-validator";
import { fileUploadRequest } from "@/schemas/requests/files/file-upload-request";
import { fileGetRequest } from "@/schemas/requests/files/file-get-request";

export const fileRouter = Router();

fileRouter.get("/:slug", zodValidator(fileGetRequest, "params"), getFile);

fileRouter.post(
  "/upload",
  Multer.single("image"),
  zodValidator(fileUploadRequest, "body"),
  uploadFile,
);
