import type { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

import { Prisma } from "@prisma/client";

import { verifyAccessToken } from "../jwt/shared.jwt.js";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      success: false,
      error: "Invalid access token",
      status: 401
    });
  };

  const parts = authorization.split(" ", 2);

  if (parts.length !== 2 || parts[0] !== "Bearer" || parts[1] === "") {
    return res.status(401).json({
      success: false,
      error: "Invalid access token",
      status: 401
    });
  };

  const accessToken = parts[1];

  const payload = verifyAccessToken(accessToken);

  if (!payload) {
    return res.status(401).json({
      success: false,
      error: "Invalid access token",
      status: 401
    });
  };

  req.user = payload;
  next();
};

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Admin privileges required",
      status: 403
    });
  };

  next();
};

export function rateLimiting() {
  return rateLimit({
    max: 100,
    windowMs: 1 * 60 * 1000,
    message: "We have received too many requests"
  });
};

export function uniqueHandler(error: unknown, _req: Request, res: Response, next: NextFunction) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return res.status(409).json({
      success: false,
      error: "An account with this email address already exists",
      status: 409
    });
  };

  next(error);
};

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(error);

  return res.status(500).json({
    success: false,
    error: "Internal server error",
    status: 500
  });
};