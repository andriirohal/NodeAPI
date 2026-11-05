import { afterEach, jest, expect, test } from "@jest/globals";

import { deleteProduct, createProduct } from "../src/services/product.service.js";
import { client } from "../src/prisma/client.js";

afterEach(async () => {
  await client.products.deleteMany();
});

test("deletes a product", async () => {
  const product = await createProduct({
    name: "Samsung galaxy S23 Ultra",
    price: 900,
    stock: 300
  });

  if (!product.success) {
    throw new Error("Expected a product");
  };

  const response = await deleteProduct(product.data.id);

  expect(response.success).toBe(true);
  expect(response.status).toBe(200);
});

test("rejects missing product", async () => {
  const response = await deleteProduct("7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d");

  expect(response.success).toBe(false);
  expect(response.status).toBe(404);
});