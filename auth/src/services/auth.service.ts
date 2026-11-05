import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

import { hashRefreshToken, isValidEmail, isValidName, isValidPassword, issueAuthentication, parseRefreshToken } from "../../../shared/src/helpers/shared.helper.js";
import type { UserInput, AuthInput, Result, UserResponse, UserRecord, Authentication } from "../../../shared/src/types/shared.types.js";

import { client } from "../prisma/client.js";

export async function signUpUser(input: UserInput): Promise<Result<UserResponse>> {
  const name = input.name;

  if (!isValidName(name)) {
    return {
      success: false,
      error: "Name cannot be empty",
      status: 400
    };
  };

  const email = input.email;

  if (!isValidEmail(email)) {
    return {
      success: false,
      error: "Please enter a valid email address",
      status: 400
    };
  };

  const password = input.password;

  if (!isValidPassword(password)) {
    return {
      success: false,
      error: "Password must be valid",
      status: 400
    };
  };

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await client.users.create({
    data: {
      name,
      email,
      password: hashedPassword
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      created_at: true
    }
  });

  const payload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  const authentication = issueAuthentication(payload);

  if (!authentication.refreshToken) {
    return {
      success: false,
      error: "Invalid refresh token",
      status: 401
    };
  };

  const hashedRefreshToken = hashRefreshToken(authentication.refreshToken);

  await client.users.update({
    data: {
      refresh_token: hashedRefreshToken
    },
    where: {
      id: user.id
    }
  });

   const response = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.created_at,
    accessToken: authentication.accessToken,
    refreshToken: authentication.refreshToken
  }; 

  return {
    success: true,
    data: response,
    status: 201
  };
};

export async function logInUser(input: AuthInput): Promise<Result<UserResponse>> {
  const email = input.email;

  if (!isValidEmail(email)) {
    return {
      success: false,
      error: "Please enter a valid email address",
      status: 400
    };
  };

  const password = input.password;

  if (!isValidPassword(password)) {
    return {
      success: false,
      error: "Password must be valid",
      status: 400
    };
  };

  const user = await client.users.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      created_at: true
    },
    where: {
      email
    }
  });

  if (!user) {
    return {
      success: false,
      error: "No account found with this email address",
      status: 401
    };
  };

  const mathes = await bcrypt.compare(password, user.password);

  if (!mathes) {
    return {
      success: false,
      error: "This password doesn't match our records",
      status: 401
    };
  };

  const payload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  const authentication = issueAuthentication(payload);

  if (!authentication.refreshToken) {
    return {
      success: false,
      error: "Invalid refresh token",
      status: 401
    };
  };

  const hashedRefreshToken = hashRefreshToken(authentication.refreshToken);

  await client.users.update({
    data: {
      refresh_token: hashedRefreshToken
    },
    where: {
      id: user.id
    }
  });

  const response = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.created_at,
    accessToken: authentication.accessToken,
    refreshToken: authentication.refreshToken
  }; 

  return {
    success: true,
    data: response,
    status: 200
  };
};

export async function getLoggedInUser(userId: string): Promise<Result<UserRecord>> {
  const user = await client.users.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      created_at: true
    },
    where: {
      id: userId
    }
  });

  if (!user) {
    return {
      success: false,
      error: "User not found",
      status: 404
    };
  };

  const response = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.created_at
  };

  return {
    success: true,
    data: response,
    status: 200
  };
};

export async function logOutUser(refreshToken: string | null): Promise<Result<UserRecord>> {
  try {
    if (!refreshToken) {
      return {
        success: false,
        error: "Invalid refresh token",
        status: 401
      };
    };
  
    const decoded = parseRefreshToken(refreshToken);
  
    if (!decoded) {
      return {
        success: false,
        error: "Invalid refresh token",
        status: 401
      };
    };
  
    const user = await client.users.update({
      data: {
        refresh_token: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true
      },
      where: {
        id: decoded.userId,
        refresh_token: hashRefreshToken(refreshToken)
      }
    });
  
    const response = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at
    };
  
    return {
      success: true,
      data: response,
      status: 200
    };

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return {
        success: false,
        error: "Invalid refresh token",
        status: 401
      };
    };

    throw error;
  };
};

export async function rotateUserTokens(refreshToken: string | null): Promise<Result<Authentication>> {
  if (!refreshToken) {
    return {
      success: false,
      error: "Invalid refresh token",
      status: 401
    };
  };

  const decoded = parseRefreshToken(refreshToken);

  if (!decoded) {
    return {
      success: false,
      error: "Invalid refresh token",
      status: 401
    };
  };

  const user = await client.users.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      refresh_token: true
    },
    where: {
      id: decoded.userId
    }
  });

  if (!user) {
    return {
      success: false,
      error: "User not found",
      status: 404
    };
  };

  if (refreshToken === null || user.refresh_token !== hashRefreshToken(refreshToken)) {
    return {
      success: false,
      error: "Invalid refresh token",
      status: 401
    };
  };

  const payload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  const authentication = issueAuthentication(payload);

  if (!authentication.refreshToken) {
    return {
      success: false,
      error: "Invalid refresh token",
      status: 401
    };
  };

  const hashedRefreshToken = hashRefreshToken(authentication.refreshToken);

  await client.users.update({
    data: {
      refresh_token: hashedRefreshToken
    },
    where: {
      id: user.id,
      refresh_token: user.refresh_token
    }
  });

  return {
    success: true,
    data: authentication,
    status: 200
  };
};