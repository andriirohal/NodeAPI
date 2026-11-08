import type { Request, Response, NextFunction } from "express";
import { jest, expect, test } from "@jest/globals";

jest.mock("../src/services/product.service.js", () => ({
  createProduct: jest.fn()
}));

import { timestamptz } from "./utils/utils.timestamptz.js";

import { createProductController } from "../src/controllers/product.controller.js";
import { createProduct } from "../src/services/product.service.js";

import type { CreateProductInput } from "../src/types/product.types.js";

test("creates a product", async () => {
  jest.mocked(createProduct).mockResolvedValue({
    success: true,
    data: {
      id: "7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d",
      name: "Samsung galaxy S26 Ultra",
      price: 2000,
      stock: 200,
      createdAt: timestamptz.createdAt,
      updatedAt: timestamptz.updatedAt,
    },
    status: 201
  });
  
  const req = {
    body: {
      name: "Samsung galaxy S26 Ultra",
      price: 2000,
      stock: 200
    }
  } as Request<{}, {}, CreateProductInput>;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await createProductController(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(201);

  expect(next).not.toHaveBeenCalled();
});

test("rejects an invalid name", async () => {
  jest.mocked(createProduct).mockResolvedValue({
    success: false,
    error: "Name cannot be empty",
    status: 400
  });

  const req = {
    body: {
      name: "",
      price: 2000,
      stock: 200
    }
  } as Request<{}, {}, CreateProductInput>;

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  await createProductController(req, res, next);

  expect(res.json).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);

  expect(next).not.toHaveBeenCalled();
});

test("passes the error to the next handler", async () => {
  const req = {} as Request<{}, {}, CreateProductInput>;

  const res = {} as Response;
  const next = jest.fn() as NextFunction;

  await createProductController(req, res, next);

  expect(next).toHaveBeenCalled();
});