import type { Response } from "express";

const STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

type ResponseProps = {
  response: Response;
  data?: Record<string, unknown>;
  message?: string;
  error?: unknown;
};

export const ReturnResponse = {
  Success: ({ response, message, data }: ResponseProps) => {
    return response.status(STATUS_CODE.SUCCESS).json({
      success: true,
      message,
      data,
    });
  },

  Created: ({ response, message, data }: ResponseProps) => {
    return response.status(STATUS_CODE.CREATED).json({
      success: true,
      message,
      data,
    });
  },

  NotFound: ({ response, message }: ResponseProps) => {
    return response.status(STATUS_CODE.NOT_FOUND).json({
      success: false,
      message,
    });
  },

  InternalServerError: ({
    response,
    message = "Internal Server Error",
    error,
  }: ResponseProps) => {
    return response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message,
      stack: error instanceof Error ? error.stack : undefined,
    });
  },
};
