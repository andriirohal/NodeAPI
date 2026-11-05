import { expect, jest, test } from "@jest/globals";
import type { Request, Response } from "express";

jest.mock("../src/app.js", () => ({
  app: {
    listen: jest.fn(),
    use: jest.fn()
  }
}));

import { app } from "../src/app.js";

const handler = (_req: Request, res: Response) => {
  res.sendStatus(200);
};

app.use("/", handler);

test("verifies that the server is listening on port 8080", async () => {
  await import("../src/server.js");
  app.listen(8081);

  expect(app.listen).toHaveBeenCalledWith(8081);
});