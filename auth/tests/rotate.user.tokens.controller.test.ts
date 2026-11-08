import { jest, expect, test } from "@jest/globals";
import type { Request, Response, NextFunction } from "express";

jest.mock("../src/services/auth.service.js", () => ({
  rotateUserTokens: jest.fn()
}));

import { rotateUserTokensController } from "../src/controllers/auth.controller.js";
import { rotateUserTokens } from "../src/services/auth.service.js";

test("rotates user tokens", async () => {
  jest.mocked(rotateUserTokens).mockResolvedValue({
    success: true,
    data: {
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature",
      refreshToken: "xY7kLm2NpQ8vRs4TuW1aBc9DeF3gHi6J.Kl5Mn8PqR2sTuV4wXy7ZaB9CdE1fGh3JkL5mN8pQ.signature"
    },
    status: 200
  });

  const req = {
    cookies: {
      refreshToken: "xY7kLm2NpQ8vRs4TuW1aBc9DeF3gHi6J.Kl5Mn8PqR2sTuV4wXy7ZaB9CdE1fGh3JkL5mN8pQ.signature"
    }
  } as unknown as Request;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    clearCookie: jest.fn(),
    cookie: jest.fn()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await rotateUserTokensController(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);

  expect(next).not.toHaveBeenCalled();
});

test("rejects an invalid refresh token", async () => {
  jest.mocked(rotateUserTokens).mockResolvedValue({
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

  await rotateUserTokensController(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(401);

  expect(next).not.toHaveBeenCalled();
});

test("rejects an invalid refresh token", async () => {
  jest.mocked(rotateUserTokens).mockResolvedValue({
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
    status: jest.fn().mockReturnThis(),
    clearCookie: jest.fn()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await rotateUserTokensController(req, res, next);
  
  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(401);

  expect(next).not.toHaveBeenCalled();
});

test("passes an error to the next handler", async () => {
  jest.mocked(rotateUserTokens).mockResolvedValue({
    success: false,
    error: "Internal server error",
    status: 500
  });

  const req = {
    cookies: {}
  } as Request;

  const res = {} as Response;
  const next = jest.fn() as NextFunction;

  await rotateUserTokensController(req, res, next);

  expect(next).toHaveBeenCalled();
});