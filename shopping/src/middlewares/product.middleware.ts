import { Prisma } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";

import validator from "validator";

export function validateId(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  const { id } = req.params;
  
  if(!validator.isUUID(id)) {
    return res.status(400).json({
      success: false,
      error: "Invalid product ID",
      status: 400
    });
  };

  next();
};

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(error);

  return res.status(500).json({
    success: false,
    error: "Internal server error",
    status: 500
  });
};