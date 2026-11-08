import { jest, expect, test } from "@jest/globals";
import type { Request, Response, NextFunction } from "express";

jest.mock("../src/services/auth.service.js", () => ({
  signUpUser: jest.fn()
}));

import type { UserInput } from "../../shared/src/types/shared.types.js";
import { timestamptz } from "./utils/utils.timestamptz.js";

import { signUpUserController } from "../src/controllers/auth.controller.js";
import { signUpUser } from "../src/services/auth.service.js";

test("signs up a user", async () => {
  jest.mocked(signUpUser).mockResolvedValue({
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
    status: 201
  });

  const req = {
    body: {
      name: "Sarah",
      email: "sarah.test@example.com",
      password: "sarah12345"
    }
  } as Request<{}, {}, UserInput>;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    cookie: jest.fn()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await signUpUserController(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(201);

  expect(next).not.toHaveBeenCalled();
});

test("rejects an invalid name", async () => {
  jest.mocked(signUpUser).mockResolvedValue({
    success: false,
    error: "Name cannot be empty",
    status: 400
  });

  const req = {
    body: {
      name: "",
      email: "sarah.test@example.com",
      password: "sarah12345" 
    }
  } as Request<{}, {}, UserInput>;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await signUpUserController(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);

  expect(next).not.toHaveBeenCalled();
});

test("passes an error to the next handler", async () => {
  jest.mocked(signUpUser).mockResolvedValue({
    success: false,
    error: "Internal server error",
    status: 500
  });

  const req = {
    body: {}
  } as Request<{}, {}, UserInput>;
  
  const res = {} as Response;
  const next = jest.fn() as NextFunction;

  await signUpUserController(req, res, next);

  expect(next).toHaveBeenCalled();
});