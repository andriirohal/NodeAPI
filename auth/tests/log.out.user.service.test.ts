import { afterEach, test, expect, jest } from "@jest/globals";

import * as authHelpers from "../../shared/src/helpers/shared.helper.js";

import { logOutUser, signUpUser } from "../src/services/auth.service.js";
import { client } from "../src/prisma/client.js";

afterEach(async () => {
  await client.users.deleteMany({
    where: {
      email: "sarah.test@example.com"
    }
  });
});

test("logs out a user", async () => {
  const createdUser = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!createdUser.success) {
    throw new Error("Expected a user");
  };

  const loggedOutUser = await logOutUser(createdUser.data.refreshToken);

  expect(loggedOutUser.success).toBe(true);
  expect(loggedOutUser.status).toBe(200);
});

test("rejects an invalid refresh token", async () => {
  const loggedOutUser = await logOutUser("");

  expect(loggedOutUser.success).toBe(false);
  expect(loggedOutUser.status).toBe(401);
});

test("rejects an invalid refresh token", async () => {
  const loggedOutUser = await logOutUser("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature");

  expect(loggedOutUser.success).toBe(false);
  expect(loggedOutUser.status).toBe(401);
});

test("rejects an invalid refresh token", async () => {
  jest.spyOn(authHelpers, "parseRefreshToken").mockReturnValue({
    userId: "550e8400-e29b-41d4-a716-446655440000",
    name: "Sarah",
    email: "sarah.test@example.com",
    role: "user"
  });
  
  const loggedOutUser = await logOutUser("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature");

  expect(loggedOutUser.success).toBe(false);
  expect(loggedOutUser.status).toBe(401);
});

test("returns a database error", async () => {
  const createdUser = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!createdUser.success) {
    throw new Error("Expected a user");
  };

  jest.spyOn(client.users, "update").mockRejectedValue(new Error("Database error"));

  await expect(logOutUser(
    createdUser.data.refreshToken)
  ).rejects.toThrow("Database error");
});