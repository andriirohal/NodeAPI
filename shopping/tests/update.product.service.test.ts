import { afterEach, expect, test } from "@jest/globals";

import { updateProduct, createProduct } from "../src/services/product.service.js";
import { client } from "../src/prisma/client.js";

afterEach(async () => {
  await client.products.deleteMany();
});

test("updates a product", async () => {
  const createdProduct = await createProduct({
    name: "Samsung galaxy S21",
    price: 400,
    stock: 100
  });

  if (!createdProduct.success) {
    throw new Error("Expected a product");
  };

  const updatedProduct = await updateProduct(createdProduct.data.id, {
    stock: 160
  });

  expect(updatedProduct.success).toBe(true);
  expect(updatedProduct.status).toBe(200);
});

test("rejects an invalid name", async () => {
  const updatedProduct = await updateProduct("7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d", {
    name: ""
  });

  expect(updatedProduct.success).toBe(false);
  expect(updatedProduct.status).toBe(400);
});

test("rejects an invalid price", async () => {
  const updatedProduct = await updateProduct("7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d", {
    price: 0
  });

  expect(updatedProduct.success).toBe(false);
  expect(updatedProduct.status).toBe(400);
});

test("rejects an invalid stock", async () => {
  const updatedProduct = await updateProduct("7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d", {
    stock: -1
  });

  expect(updatedProduct.success).toBe(false);
  expect(updatedProduct.status).toBe(400);
});

test("rejects missing product", async () => {
  const updatedProduct = await updateProduct("7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d", {
    stock: 160
  });

  expect(updatedProduct.success).toBe(false);
  expect(updatedProduct.status).toBe(404);
});