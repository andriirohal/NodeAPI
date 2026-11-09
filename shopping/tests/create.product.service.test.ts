import { afterEach, expect, test } from "@jest/globals";

import { createProduct } from "../src/services/product.service.js";
import { client } from "../src/prisma/client.js";

afterEach(async () => {
  await client.products.deleteMany();
});

test("creates a product", async () => {
  const createdProduct = await createProduct({
    name: "Samsung galaxy S26 Ultra",
    price: 2000,
    stock: 200
  }); 

  expect(createdProduct.success).toBe(true);
  expect(createdProduct.status).toBe(201);
});

test("rejects an invalid name", async () => {
  const createdProduct = await createProduct({
    name: "",
    price: 2000,
    stock: 200
  });

  expect(createdProduct.success).toBe(false);
  expect(createdProduct.status).toBe(400);
});

test("rejects an invalid price", async () => {
  const createdProduct = await createProduct({
    name: "Samsung galaxy S26",
    price: 0,
    stock: 200
  });

  expect(createdProduct.success).toBe(false);
  expect(createdProduct.status).toBe(400);
});

test("rejects an invalid stock", async () => {
  const createdProduct = await createProduct({
    name: "Samsung galaxy S26",
    price: 2000,
    stock: -1
  });

  expect(createdProduct.success).toBe(false);
  expect(createdProduct.status).toBe(400);
});