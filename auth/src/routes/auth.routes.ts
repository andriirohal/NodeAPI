import { Router } from "express";

import { logInUserController, signUpUserController, logOutUserController, getLoggedInUserController, rotateUserTokensController } from "../controllers/auth.controller.js";
import { authenticate } from "../../../shared/src/middlewares/shared.middleware.js";

export const router = Router();

router.post("/signup", signUpUserController);
router.post("/login", logInUserController);

router.post("/refresh", rotateUserTokensController);

router.get("/profile", authenticate, getLoggedInUserController);
router.delete("/logout", logOutUserController);