import type { Request, Response, NextFunction } from "express";
import { test, expect, jest } from "@jest/globals";

import { validateId } from "../src/middlewares/product.middleware.js";
import { isValidName, isValidPrice, isValidStock } from "../src/helpers/product.helper.js";

test("validates name", () => {
  expect(isValidName("")).toBe(false);
  expect(isValidName(999)).toBe(false);
  expect(isValidName("John")).toBe(true);
});

test("validate price", () => {
  expect(isValidPrice(999999999)).toBe(false);
  expect(isValidPrice("999")).toBe(false);
  expect(isValidPrice(-1)).toBe(false);
  expect(isValidPrice(0)).toBe(false);
  expect(isValidPrice(999)).toBe(true);
});

test("validates stock", () => {
  expect(isValidStock(100.99)).toBe(false);
  expect(isValidStock(-1)).toBe(false);
  expect(isValidStock(0)).toBe(true);
  expect(isValidStock(1)).toBe(true);
  expect(isValidStock("999")).toBe(false);
});

test("accepts a valid id", () => {
  const req = {
    params: {
      id: "550e8400-e29b-41d4-a716-446655440000"
    }
  } as Request<{ id: string }>;

  const res = {} as Response;
  const next = jest.fn() as NextFunction;

  validateId(req, res, next);

  expect(next).toHaveBeenCalled();
});

test("rejects an invalid id", () => {
  const req = {
    params: {
      id: "12345-67890"
    }
  } as Request<{ id: string }>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  validateId(req, res, next);

  expect(next).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);

  expect(res.json).toHaveBeenCalled();
});