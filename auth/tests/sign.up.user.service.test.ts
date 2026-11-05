import { afterEach, test, expect } from "@jest/globals";

import * as authHelpers from "../../shared/src/helpers/shared.helper.js";

import { signUpUser } from "../src/services/auth.service.js";
import { client } from "../src/prisma/client.js";

afterEach(async () => {
  await client.users.deleteMany({
    where: {
      email: "sarah.test@example.com" 
    }
  });
});

test("signs up a user", async () => {
  const response = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  expect(response.success).toBe(true);
  expect(response.status).toBe(201);
});

test("rejects an invalid name", async () => {
  const response = await signUpUser({
    name: "",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  expect(response.success).toBe(false);
  expect(response.status).toBe(400);
});

test("rejects an invalid email", async () => {
  const response = await signUpUser({
    name: "Sarah",
    email: "sarah.test",
    password: "sarah12345"
  });

  expect(response.success).toBe(false);
  expect(response.status).toBe(400);
});

test("rejects an invalid password", async () => {
  const response = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: ""
  });

  expect(response.success).toBe(false);
  expect(response.status).toBe(400);
});

test("rejects an invalid refresh token", async () => {
  jest.spyOn(authHelpers, "issueAuthentication").mockReturnValue({
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature",
    refreshToken: ""
  });

  const response = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  expect(response.success).toBe(false);
  expect(response.status).toBe(401);
});