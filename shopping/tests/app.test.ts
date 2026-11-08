import { expect, test } from "@jest/globals";
import req from "supertest";

import { app } from "../src/app.js";

test("handles app health check", async () => {
  const response = await req(app).get("/");

  expect(response.status).toBe(200);
});