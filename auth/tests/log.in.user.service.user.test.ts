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
  await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  const loggedInUser = await logInUser({
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  expect(loggedInUser.success).toBe(true);
  expect(loggedInUser.status).toBe(200);
});

test("rejects an invalid email", async () => {
  await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  const loggedInUser = await logInUser({
    email: "sarah.test@",
    password: "sarah12345"
  });

  expect(loggedInUser.success).toBe(false);
  expect(loggedInUser.status).toBe(400);
});

test("rejects an invalid password", async () => {
  await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  const loggedInUser = await logInUser({
    email: "sarah.test@example.com",
    password: ""
  });

  expect(loggedInUser.success).toBe(false);
  expect(loggedInUser.status).toBe(400);
});

test("rejects an invalid email", async () => {
  await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  const loggedInUser = await logInUser({
    email: "sarah.invalid@example.com",
    password: "sarah12345"
  });

  expect(loggedInUser.success).toBe(false);
  expect(loggedInUser.status).toBe(401);
});

test("rejects an invalid password", async () => {
  await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  const loggedInUser = await logInUser({
    email: "sarah.test@example.com",
    password: "invalid12345"
  });

  expect(loggedInUser.success).toBe(false);
  expect(loggedInUser.status).toBe(401);
});

test("rejects an invalid refresh token", async () => {
  await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  jest.spyOn(authHelpers, "issueAuthentication").mockReturnValue({
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature",
    refreshToken: ""
  });

  const loggedInUser = await logInUser({
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  expect(loggedInUser.success).toBe(false);
  expect(loggedInUser.status).toBe(401);
});