import { jest, test, expect } from "@jest/globals";
import type { Request, Response, NextFunction } from "express";

import type { UserPayload } from "../../shared/src/types/express.js";

import { signAccessToken } from "../../shared/src/jwt/shared.jwt.js";
import { timestamptz } from "./utils/utils.timestamptz.js";

jest.mock("../src/services/auth.service.js", () => ({
  getLoggedInUser: jest.fn()
}));

import { getLoggedInUserController } from "../src/controllers/auth.controller.js";
import { getLoggedInUser } from "../src/services/auth.service.js";

test("gets a logged in user", async () => {
  jest.mocked(getLoggedInUser).mockResolvedValue({
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

  const accessToken = signAccessToken(payload);

  const req = {
    user: {
      userId: "7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d"
    },

    headers: {
      authorization: `Bearer ${accessToken}`
    }
  } as unknown as Request;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await getLoggedInUserController(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);

  expect(next).not.toHaveBeenCalled();
});

test("rejects an missing user", async () => {
  jest.mocked(getLoggedInUser).mockResolvedValue({
    success: false,
    error: "User not found",
    status: 404
  });

  const payload = {
    userId: "7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d",
    name: "Sarah",
    email: "sarah.test@example.com",
    role: "user"
  } as UserPayload;

  const accessToken = signAccessToken(payload);

  const req = {
    user: {
      userId: "a3bb189e-8bf9-3888-9912-ace4e6543002"
    },

    headers: {
      authorization: `Bearer ${accessToken}`
    }
  } as unknown as Request;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await getLoggedInUserController(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(404);

  expect(next).not.toHaveBeenCalled();
});

test("passes an error to the next handler", async () => {
  jest.mocked(getLoggedInUser).mockResolvedValue({
    success: false,
    error: "Internal server error",
    status: 500
  });

  const req = {
    user: {},
    headers: {
      authorization: ""
    }
  } as Request;

  const res = {} as Response;
  const next = jest.fn() as NextFunction;

  await getLoggedInUserController(req, res, next);

  expect(next).toHaveBeenCalled();
});