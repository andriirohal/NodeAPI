import { afterEach, test, expect } from "@jest/globals";

import { getLoggedInUser, signUpUser } from "../src/services/auth.service.js";
import { client } from "../src/prisma/client.js";

afterEach(async () => {
  await client.users.deleteMany({
    where: {
      email: "sarah.test@example.com"
    }
  });
});

test("gets the logged in user", async () => {
  const createdUser = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!createdUser.success) {
    throw new Error("Expected a user");
  };

  const loggedInUser = await getLoggedInUser(createdUser.data.userId);

  expect(loggedInUser.success).toBe(true);
  expect(loggedInUser.status).toBe(200);
});

test("rejects missing user", async () => {
  await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  const loggedInUser = await getLoggedInUser("7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d");

  expect(loggedInUser.success).toBe(false);
  expect(loggedInUser.status).toBe(404);
});