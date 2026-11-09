import { test, expect } from "@jest/globals";

import { getProducts, createProduct } from "../src/services/product.service.js";

test("gets products", async () => {
  await createProduct({
    name: "Samsung galaxy S25 Ultra",
    price: 1800,
    stock: 230
  });
  
  const retrievedProducts = await getProducts(10, 0);

  expect(retrievedProducts.success).toBe(true);
  expect(retrievedProducts.status).toBe(200);
});