import express from "express";
import type { Request, Response } from "express";

import cors from "cors";

import { errorHandler, uniqueHandler } from "./middlewares/product.middleware.js";
import { router } from "./routes/product.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", router);

app.get("/", (_req: Request, res: Response) => {
  res.sendStatus(200);
});

app.use(uniqueHandler, errorHandler);