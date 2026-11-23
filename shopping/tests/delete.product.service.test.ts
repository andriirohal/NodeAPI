import { jest, afterEach, expect, test } from "@jest/globals";

import { deleteProduct, createProduct } from "../src/services/product.service.js";
import { client } from "../src/prisma/client.js";

afterEach(async () => {
  await client.products.deleteMany();
});

test("deletes a product", async () => {
  const createdProduct = await createProduct({
    name: "Laptop",
    price: 1000,
    stock: 200
  });

  if (!createdProduct.success) {
    throw new Error("Expected a product");
  };

  const deletedProduct = await deleteProduct(createdProduct.data.id);

  expect(deletedProduct.success).toBe(true);
  expect(deletedProduct.status).toBe(200);
});

test("rejects missing product", async () => {
  const deletedProduct = await deleteProduct("b11d3031-0c6e-48b0-9245-df16625c223a");

  expect(deletedProduct.success).toBe(false);
  expect(deletedProduct.status).toBe(404);
});

test("returns a database error", async () => {
  jest.spyOn(client.products, "delete").mockRejectedValue(new Error("Database error"));

  await expect(deleteProduct(
    "b11d3031-0c6e-48b0-9245-df16625c223a"
  )).rejects.toThrow("Database error");
});