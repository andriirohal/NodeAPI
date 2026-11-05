import { afterEach, test, expect, jest } from "@jest/globals";

import * as authHelpers from "../../shared/src/helpers/shared.helper.js";

import { logInUser, signUpUser } from "../src/services/auth.service.js";
import { client } from "../src/prisma/client.js";

afterEach(async () => {
  await client.users.deleteMany({
    where: {
      email: "sarah.test@example.com" 
    }
  });
});

test("logs in a user", async () => {
  const user = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!user.success) {
    throw new Error("Expected a user");
  };

  const response = await logInUser({
    email: user.data.email,
    password: "sarah12345"
  });

  expect(response.success).toBe(true);
  expect(response.status).toBe(200);
});

test("rejects an invalid email", async () => {
  const user = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!user.success) {
    throw new Error("Expected a user");
  };

  const response = await logInUser({
    email: "sarah.test",
    password: "sarah12345"
  });

  expect(response.success).toBe(false);
  expect(response.status).toBe(400);
});

test("rejects an invalid password", async () => {
  const user = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!user.success) {
    throw new Error("Expected a user");
  };

  const response = await logInUser({
    email: "sarah.test@example.com",
    password: ""
  });

  expect(response.success).toBe(false);
  expect(response.status).toBe(400);
});

test("rejects an invalid email", async () => {
  const user = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!user.success) {
    throw new Error("Expected a user");
  };

  const response = await logInUser({
    email: "sarah.invalid@example.com",
    password: "sarah12345"
  });

  expect(response.success).toBe(false);
  expect(response.status).toBe(401);
});

test("rejects an invalid password", async () => {
  const user = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!user.success) {
    throw new Error("Expected a user");
  };

  const response = await logInUser({
    email: "sarah.test@example.com",
    password: "invalid12345"
  });

  expect(response.success).toBe(false);
  expect(response.status).toBe(401);
});

test("rejects an invalid refresh token", async () => {
  const user = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!user.success) {
    throw new Error("Expected a user");
  };

  jest.spyOn(authHelpers, "issueAuthentication").mockReturnValue({
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature",
    refreshToken: ""
  });

  const response = await logInUser({
    email: user.data.email,
    password: "sarah12345"
  });

  expect(response.success).toBe(false);
  expect(response.status).toBe(401);
});