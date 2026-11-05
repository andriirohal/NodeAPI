import { Router } from "express";

import * as controllers from "../controllers/product.controller.js";
import { validateId } from "../middlewares/product.middleware.js";

import { authenticate, requireAdmin } from "../../../shared/src/middlewares/shared.middleware.js";

export const router = Router();

router.get("/", controllers.getProductsController);
router.post("/", authenticate, requireAdmin, controllers.createProductController);
router.get("/:id", validateId, controllers.getProductController);
router.patch("/:id", authenticate, requireAdmin, validateId, controllers.updateProductController);
router.delete("/:id", authenticate, requireAdmin, validateId, controllers.deleteProductController);