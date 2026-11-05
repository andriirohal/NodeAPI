import { jest, test, expect } from "@jest/globals";
import type { Request, Response, NextFunction } from "express";

import { errorHandler } from "../src/middlewares/shared.middleware.js";

test("returns an internal server error", () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  
  const error = {} as unknown;
  const req = {} as Request;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  errorHandler(error, req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(500);
});