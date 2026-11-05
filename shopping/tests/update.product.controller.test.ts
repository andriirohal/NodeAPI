import { jest, expect, test } from "@jest/globals";
import type { Request, Response, NextFunction } from "express";

import type { UpdateProductInput } from "../src/types/product.types.js";
import { timestamptz } from "./utils/utils.timestamptz.js";

jest.mock("../src/services/product.service.js", () => ({
  updateProduct: jest.fn()
}));

import { updateProductController } from "../src/controllers/product.controller.js";
import { updateProduct } from "../src/services/product.service.js";

test("updates a product", async () => {
  jest.mocked(updateProduct).mockResolvedValue({
    success: true,
    data: {
      id: "7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d",
      name: "Samsung galaxy S26 Ultra",
      price: 2000,
      stock: 200,
      createdAt: timestamptz.createdAt,
      updatedAt: timestamptz.updatedAt,
    },
    status: 200
  });

  const req = {
    params: {
      id: "7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d"
    },
    
    body: {
      name: "Samsung galaxy S26 Ultra",
      price: 2000,
      stock: 300
    }
  } as Request<{ id: string }, {}, UpdateProductInput>;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await updateProductController(req, res, next);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalled();

  expect(next).not.toHaveBeenCalled();
});

test("rejects missing product", async () => {
  jest.mocked(updateProduct).mockResolvedValue({
    success: false,
    error: "Product not found",
    status: 404
  });

  const req = {
    params: {
      id: "a1b2c3d4-e5f6-4789-8123-456789abcdef"
    },

    body: {
      name: "Samsung galaxy S26 Ultra",
      price: 2000,
      stock: 300 
    }
  } as Request<{ id: string }, {}, UpdateProductInput>;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await updateProductController(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(404);

  expect(next).not.toHaveBeenCalled();
});

test("passes an error to the next handler", async () => {
  const req = {} as Request<{ id: string }, {}, UpdateProductInput>;
  const res = {} as Response;

  const next = jest.fn() as NextFunction;

  await updateProductController(req, res, next);

  expect(next).toHaveBeenCalled();
}); 