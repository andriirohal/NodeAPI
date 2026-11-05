import type { Request, Response, NextFunction } from "express";

import { clearRefreshToken, setRefreshToken } from "../../../shared/src/helpers/shared.helper.js";

import { logInUser, logOutUser, signUpUser, rotateUserTokens, getLoggedInUser } from "../services/auth.service.js";
import type { AuthInput, UserInput } from "../../../shared/src/types/shared.types.js";

export async function signUpUserController(req: Request<{}, {}, UserInput>, res: Response, next: NextFunction) {
  try {
    const response = await signUpUser(req.body);
    
    if (!response.success) {
      return res.status(response.status).json(response);
    };

    const { refreshToken, ...data } = response.data;
    res.cookie("refreshToken", refreshToken, setRefreshToken());

    return res.status(response.status).json(data);

  } catch (error) {
    next(error);
  };
};

export async function logInUserController(req: Request<{}, {}, AuthInput>, res: Response, next: NextFunction) {
  try {
    const response = await logInUser(req.body);
    
    if (!response.success) {
      return res.status(response.status).json(response);
    };

    const { refreshToken, ...data } = response.data;
    res.cookie("refreshToken", refreshToken, setRefreshToken());

    return res.status(response.status).json(data);

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

    const response = await logOutUser(refreshToken);

    if (!response.success) {
      return res.status(response.status).json(response);
    };

    res.clearCookie("refreshToken", clearRefreshToken());
    return res.status(response.status).json(response.data);

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

    const response = await rotateUserTokens(refreshToken);

    if (!response.success) {
      res.clearCookie("refreshToken", clearRefreshToken());
      
      return res.status(response.status).json(response);
    };

    const { refreshToken: storedRefreshToken, ...data } = response.data;
    res.cookie("refreshToken", storedRefreshToken, clearRefreshToken());

    return res.status(response.status).json(data);

  } catch (error) {
    next(error);
  };
};

export async function getLoggedInUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.user;

    const response = await getLoggedInUser(userId);
    
    if (!response.success) {
      return res.status(response.status).json(response);
    };

    return res.status(response.status).json(response.data);

  } catch (error) {
    next(error);
  };
};