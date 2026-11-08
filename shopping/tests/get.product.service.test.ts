import { expect, test } from "@jest/globals";

import { getProduct, createProduct } from "../src/services/product.service.js";

test("gets a product", async () => {
  const product = await createProduct({
    name: "Samsung galaxy S23",
    price: 500,
    stock: 20
  });

  if (!product.success) {
    throw new Error("Expected a product");
  };

  const response = await getProduct(product.data.id);

  expect(response.success).toBe(true);
  expect(response.status).toBe(200);
});

test("rejects missing product", async () => {
  const response = await getProduct("7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d");

  expect(response.success).toBe(false);
  expect(response.status).toBe(404);
});