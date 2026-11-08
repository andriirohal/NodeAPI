import { jest, test, expect } from "@jest/globals";
import type { Request, Response, NextFunction } from "express";

import { timestamptz } from "./utils/utils.timestamptz.js";

jest.mock("../src/services/product.service.js", () => ({
  getProducts: jest.fn()
}));

import { getProductsController } from "../src/controllers/product.controller.js";
import { getProducts } from "../src/services/product.service.js";

test("gets products", async () => {
  jest.mocked(getProducts).mockResolvedValue({
    success: true,
    data: [
      {
        id: "7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d",
        name: "Samsung galaxy S26 Ultra",
        price: 2000,
        stock: 200,
        createdAt: timestamptz.createdAt,
        updatedAt: timestamptz.updatedAt
      }
    ],
    status: 200
  });

  const req = {
    query: {
      limit: 10,
      offset: 0 
    }
  } as Request<{}, {}, {}, { limit: number, offset: number }>;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await getProductsController(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);

  expect(next).not.toHaveBeenCalled();
});

test("passes the error to the next handler", async () => {
  const req = {} as Request<{}, {}, {}, { limit: number, offset: number }>;

  const res = {} as Response;
  const next = jest.fn() as NextFunction;

  await getProductsController(req, res, next);

  expect(next).toHaveBeenCalled();
});