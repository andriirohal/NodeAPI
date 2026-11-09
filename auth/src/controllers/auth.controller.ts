import type { Request, Response, NextFunction } from "express";

import { clearRefreshToken, setRefreshToken } from "../../../shared/src/helpers/shared.helper.js";

import { logInUser, logOutUser, signUpUser, rotateUserTokens, getLoggedInUser } from "../services/auth.service.js";
import type { AuthInput, UserInput } from "../../../shared/src/types/shared.types.js";

export async function signUpUserController(req: Request<{}, {}, UserInput>, res: Response, next: NextFunction) {
  try {
    const createdUser = await signUpUser(req.body);
    
    if (!createdUser.success) {
      return res.status(createdUser.status).json(createdUser.error);
    };

    const { refreshToken, ...data } = createdUser.data;
    res.cookie("refreshToken", refreshToken, setRefreshToken());

    return res.status(createdUser.status).json(data);

  } catch (error) {
    next(error);
  };
};

export async function logInUserController(req: Request<{}, {}, AuthInput>, res: Response, next: NextFunction) {
  try {
    const loggedInUser = await logInUser(req.body);
    
    if (!loggedInUser.success) {
      return res.status(loggedInUser.status).json(loggedInUser.error);
    };

    const { refreshToken, ...data } = loggedInUser.data;
    res.cookie("refreshToken", refreshToken, setRefreshToken());

    return res.status(loggedInUser.status).json(data);

  } catch (error) {
    next(error);
  };
};

export async function logOutUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: "Invalid refresh token",
        status: 401
      });
    };

    const loggedOutUser = await logOutUser(refreshToken);

    if (!loggedOutUser.success) {
      return res.status(loggedOutUser.status).json(loggedOutUser.error);
    };

    res.clearCookie("refreshToken", clearRefreshToken());
    return res.status(loggedOutUser.status).json(loggedOutUser.data);

  } catch (error) {
    next(error);
  };
};

export async function rotateUserTokensController(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: "Invalid refresh token",
        status: 401
      });
    };

    const rotatedTokens = await rotateUserTokens(refreshToken);

    if (!rotatedTokens.success) {
      res.clearCookie("refreshToken", clearRefreshToken());
      
      return res.status(rotatedTokens.status).json(rotatedTokens.error);
    };

    const { refreshToken: storedRefreshToken, ...data } = rotatedTokens.data;
    res.cookie("refreshToken", storedRefreshToken, clearRefreshToken());

    return res.status(rotatedTokens.status).json(data);

  } catch (error) {
    next(error);
  };
};

export async function getLoggedInUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.user;

    const loggedInUser = await getLoggedInUser(userId);
    
    if (!loggedInUser.success) {
      return res.status(loggedInUser.status).json(loggedInUser.error);
    };

    return res.status(loggedInUser.status).json(loggedInUser.data);

  } catch (error) {
    next(error);
  };
};