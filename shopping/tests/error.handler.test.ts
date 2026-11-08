import type { Request, Response, NextFunction } from "express";
import { jest, expect, test } from "@jest/globals";

import { errorHandler } from "../src/middlewares/product.middleware.js";

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