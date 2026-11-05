import { jest, expect, test } from "@jest/globals";
import type { Request, Response, NextFunction } from "express";

import { timestamptz } from "./utils/utils.timestamptz.js";

jest.mock("../src/services/product.service.js", () => ({
  getProduct: jest.fn()
}));

import { getProduct } from "../src/services/product.service.js";
import { getProductController } from "../src/controllers/product.controller.js";

test("gets a product", async () => {
  jest.mocked(getProduct).mockResolvedValue({
    success: true,
    data: {
      id: "7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d",
      name: "Samsung galaxy S26 Ultra",
      price: 2000,
      stock: 200,
      createdAt: timestamptz.createdAt,
      updatedAt: timestamptz.updatedAt
    },
    status: 200
  });

  const req = {
    params: {
      id: "7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d"
    }
  } as Request<{ id: string }>;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await getProductController(req, res, next);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalled();

  expect(next).not.toHaveBeenCalled();
});

test("rejects missing product", async () => {
  jest.mocked(getProduct).mockResolvedValue({
    success: false,
    error: "Product not found",
    status: 404
  });

  const req = {
    params: {
      id: "a1b2c3d4-e5f6-4789-8123-456789abcdef"
    }
  } as Request<{ id: string }>;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await getProductController(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(404);

  expect(next).not.toHaveBeenCalled();
});

test("passes an error to the next handler", async () => {
  const req = {} as Request<{ id: string }>;

  const res = {} as Response;
  const next = jest.fn() as NextFunction;

  await getProductController(req, res, next);

  expect(next).toHaveBeenCalled();
});