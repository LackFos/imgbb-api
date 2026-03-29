import { Router } from "express";
import { uploadFile } from "@/controllers/files/file-controller";
import { Multer } from "@/middlewares/multer";
import { zodValidator } from "@/middlewares/zod-validator";
import { fileUploadRequest } from "@/schemas/requests/file-upload-request";

export const fileRouter = Router();

fileRouter.post(
  "/upload",
  Multer.single("image"),
  zodValidator(fileUploadRequest),
  uploadFile,
);
