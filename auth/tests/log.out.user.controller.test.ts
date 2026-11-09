import { jest, test, expect } from "@jest/globals";
import type { Request, Response, NextFunction } from "express";

import { signRefreshToken } from "../../shared/src/jwt/shared.jwt.js";

import { timestamptz } from "./utils/utils.timestamptz.js";
import type { UserPayload } from "../../shared/src/types/express.js";

jest.mock("../src/services/auth.service.js", () => ({
  logOutUser: jest.fn()
}));

import { logOutUserController } from "../src/controllers/auth.controller.js";
import { logOutUser } from "../src/services/auth.service.js";

test("logs out a user", async () => {
  jest.mocked(logOutUser).mockResolvedValue({
    success: true,
    data: {
      userId: "7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d",
      name: "Sarah",
      email: "sarah.test@example.com",
      role: "user",
      createdAt: timestamptz.createdAt
    },
    status: 200
  });

  const payload = {
    userId: "7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d",
    name: "Sarah",
    email: "sarah.test@example.com",
    role: "user"
  } as UserPayload;
  
  const refreshToken = signRefreshToken(payload);

  const req = {
    cookies: {
      refreshToken
    }
  } as unknown as Request;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    clearCookie: jest.fn()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await logOutUserController(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);

  expect(next).not.toHaveBeenCalled();
});

test("rejects an invalid refresh token", async () => {
  jest.mocked(logOutUser).mockResolvedValue({
    success: false,
    error: "Invalid refresh token",
    status: 401
  });

  const req = {
    cookies: {
      refreshToken: ""
    }
  } as unknown as Request;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await logOutUserController(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(401);

  expect(next).not.toHaveBeenCalled();
});

test("passes an error to the next handler", async () => {
  jest.mocked(logOutUser).mockResolvedValue({
    success: false,
    error: "Internal server error",
    status: 500
  });

  const req = {
    cookies: {}
  } as Request;

  const res = {} as Response;
  const next = jest.fn() as NextFunction;

  await logOutUserController(req, res, next);

  expect(next).toHaveBeenCalled();
});

test("rejects an invalid refresh token", async () => {
  jest.mocked(logOutUser).mockResolvedValue({
    success: false,
    error: "Invalid refresh token",
    status: 401
  });

  const req = {
    cookies: {
      refreshToken: "xY7kLm2NpQ8vRs4TuW1aBc9DeF3gHi6J.Kl5Mn8PqR2sTuV4wXy7ZaB9CdE1fGh3JkL5mN8pQ.signature"
    }
  } as unknown as Request; 

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await logOutUserController(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(401);

  expect(next).not.toHaveBeenCalled();
}); 