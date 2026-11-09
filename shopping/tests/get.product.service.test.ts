import { expect, test } from "@jest/globals";

import { getProduct, createProduct } from "../src/services/product.service.js";

test("gets a product", async () => {
  const createdProduct = await createProduct({
    name: "Samsung galaxy S23",
    price: 500,
    stock: 20
  });

  if (!createdProduct.success) {
    throw new Error("Expected a product");
  };

  const retrievedProduct = await getProduct(createdProduct.data.id);

  expect(retrievedProduct.success).toBe(true);
  expect(retrievedProduct.status).toBe(200);
});

test("rejects missing product", async () => {
  const retrievedProduct = await getProduct("7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d");

  expect(retrievedProduct.success).toBe(false);
  expect(retrievedProduct.status).toBe(404);
});