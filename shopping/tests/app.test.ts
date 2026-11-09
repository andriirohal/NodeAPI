import { expect, test } from "@jest/globals";
import req from "supertest";

import { app } from "../src/app.js";

test("handles app health check", async () => {
  const server = await req(app).get("/");

  expect(server.status).toBe(200);
});