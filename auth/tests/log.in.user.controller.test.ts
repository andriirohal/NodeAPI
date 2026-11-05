import { jest, test, expect } from "@jest/globals";

import type { AuthInput } from "../../shared/src/types/shared.types.js";

import { timestamptz } from "./utils/utils.timestamptz.js";
import type { Request, Response, NextFunction } from "express";

jest.mock("../src/services/auth.service.js", () => ({
  logInUser: jest.fn()
}));

import { logInUserController } from "../src/controllers/auth.controller.js";
import { logInUser } from "../src/services/auth.service.js";

test("logs in a user", async () => {
  jest.mocked(logInUser).mockResolvedValue({
    success: true,
    data: {
      userId: "7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d",
      name: "Sarah",
      email: "sarah.test@example.com",
      role: "user",
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature",
      refreshToken: "xY7kLm2NpQ8vRs4TuW1aBc9DeF3gHi6J.Kl5Mn8PqR2sTuV4wXy7ZaB9CdE1fGh3JkL5mN8pQ.signature",
      createdAt: timestamptz.createdAt
    },
    status: 200
  });

  const req = {
    body: {
      email: "sarah.test@example.com",
      password: "sarah12345"
    }
  } as Request<{}, {}, AuthInput>;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    cookie: jest.fn()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await logInUserController(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);

  expect(next).not.toHaveBeenCalled();
});

test("rejects an invalid email", async () => {
  jest.mocked(logInUser).mockResolvedValue({
    success: false,
    error: "Please enter a valid email address",
    status: 400
  });

  const req = {
    body: {
      email: "sarah@",
      password: "sarah12345"
    }
  } as Request<{}, {}, AuthInput>;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await logInUserController(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);

  expect(next).not.toHaveBeenCalled();
});

test("passes an error to the next handler", async () => {
  jest.mocked(logInUser).mockResolvedValue({
    success: false,
    error: "Internal server error",
    status: 500
  });
  
  const req = {
    body: {}
  } as Request<{}, {}, AuthInput>;

  const res = {} as Response;
  const next = jest.fn() as NextFunction;

  await logInUserController(req, res, next);

  expect(next).toHaveBeenCalled();
}); 