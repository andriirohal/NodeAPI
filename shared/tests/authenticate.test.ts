import { jest, test, expect } from "@jest/globals";
import type { Request, Response, NextFunction } from "express";

import { signAccessToken } from "../src/jwt/shared.jwt.js";

import { authenticate } from "../src/middlewares/shared.middleware.js";
import type { UserPayload } from "../src/types/express.js";

test("authenticates a user", () => {
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

  const res = {} as Response;
  const next = jest.fn() as NextFunction;

  authenticate(req, res, next);

  expect(req.user).toEqual(
    expect.objectContaining({
      userId: "7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d",
      name: "Sarah",
      email: "sarah.test@example.com",
      role: "user" 
    })
  );

  expect(next).toHaveBeenCalled();
});

test("rejecta an invalid authorization header", () => {  
  const req = {
    user: {
      userId: "7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d"
    },

    headers: {}
  } as Request;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  authenticate(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(401);

  expect(next).not.toHaveBeenCalled();
});

test("rejects an invalid access token", () => {
  const req = {
    user: {
      userId: "7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d"
    },

    headers: {
      authorization: "Bearer "
    }
  } as Request;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  authenticate(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(401);

  expect(next).not.toHaveBeenCalled();
});

test("rejects an empty user payload", () => {
  const payload = {} as UserPayload;
  const accessToken = signAccessToken(payload);

  const req = {
    user: {
      userId: ""
    },

    headers: {
      authorization: `Bearer ${accessToken}`
    }
  } as Request;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  authenticate(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(401);

  expect(next).not.toHaveBeenCalled();
});