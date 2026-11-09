import { jest, test, expect } from "@jest/globals";
import type { Request, Response, NextFunction } from "express";

import { requireAdmin } from "../src/middlewares/shared.middleware.js";
import { UserPayload } from "../src/types/shared.types.js";

test("denies non-admin access", () => {
  const req = {
    user: {
      userId: "7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d",
      name: "Sarah",
      email: "sarah.test@example.com",
      role: "user" 
    }
  } as Request<{}, {}, UserPayload>;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  requireAdmin(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(403);

  expect(next).not.toHaveBeenCalled();
});

test("allows admin access", () => {
  const req = {
    user: {
      userId: "7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d",
      name: "Sarah",
      email: "sarah.test@example.com",
      role: "admin" 
    }
  } as Request<{}, {}, UserPayload>;

  const res = {} as Response;
  const next = jest.fn() as NextFunction;

  requireAdmin(req, res, next);

  expect(next).toHaveBeenCalled();
});