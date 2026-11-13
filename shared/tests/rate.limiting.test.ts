import { test, expect } from "@jest/globals";
import type { Request, Response } from "express"

import express from "express";
import req from "supertest";

import { rateLimiting } from "../src/middlewares/shared.middleware.js";

const app = express();

app.use(rateLimiting());

app.post("/signup", (_req: Request, res: Response) => {
  res.sendStatus(201);
});

test("rejects requests after reaching the limit", async () => {
  for (let i = 0; i <= 100; i++) {
    await req(app).post("/signup");
  };

  const res = await req(app).get("/signup");

  expect(res.status).toBe(429);
});