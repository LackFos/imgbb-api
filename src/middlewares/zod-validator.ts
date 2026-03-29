import type { z } from "zod";
import type { NextFunction, Request, Response } from "express";

export function zodValidator(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    populateFileToRequestBody(req);
    schema.parse(req.body);
    next();
  };
}

function populateFileToRequestBody(req: Request) {
  if (req.file) {
    req.body[req.file.fieldname] = req.file;
  }

  if (req.files) {
    // Populate File[] -> { fieldname: File[] }
    if (Array.isArray(req.files)) {
      const files: Express.Multer.File[] = req.files;
      req.body[files[0].fieldname] = files;
      return;
    }

    // Populate { fieldname: File } -> { fieldname: File }
    if (req.files instanceof Object) {
      req.body = { ...req.body, ...req.files };
    }
  }
}
