import type { Request, Response } from "express";
import express from "express";

import cookieParser from "cookie-parser";

import { errorHandler, rateLimiting, uniqueHandler } from "../../shared/src/middlewares/shared.middleware.js";
import { router } from "./routes/auth.routes.js";

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(rateLimiting());

app.use("/", router);

app.get("/", (_req: Request, res: Response) => {
  res.sendStatus(200);
});

app.use(uniqueHandler, errorHandler);