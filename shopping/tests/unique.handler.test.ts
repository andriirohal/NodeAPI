import type { Request, Response, NextFunction } from "express";
import { jest, expect, test } from "@jest/globals";

import { Prisma } from "@prisma/client";

import { uniqueHandler } from "../src/middlewares/product.middleware.js";

test("rejects a product with an existing name", () => {
  const error = new Prisma.PrismaClientKnownRequestError("Record already exists", {
    code: "P2002",
    clientVersion: "test"
  }) as unknown; 

  const req = {} as Request;
  
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  uniqueHandler(error, req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(409);

  expect(next).not.toHaveBeenCalled();
});

test("passes an error to the next handler", () => {
  const error = {} as unknown;
  const req = {} as Request;

  const res = {} as Response;
  const next = jest.fn() as NextFunction;

  uniqueHandler(error, req, res, next);

  expect(next).toHaveBeenCalledWith(error);
});