import { expect, test } from "@jest/globals";

import { isValidEmail, isValidName, isValidPassword, isUserPayload } from "../src/helpers/shared.helper.js";
import { getEnvironmentKey } from "../src/jwt/shared.jwt.js";

test("validates name", () => {
  expect(isValidName("Sarah")).toBe(true);
  expect(isValidName(999)).toBe(false);
  expect(isValidName("")).toBe(false);
  expect(isValidName(" ")).toBe(false);
});

test("validates email", () => {
  expect(isValidEmail("sarah.test@example.com")).toBe(true);
  expect(isValidEmail("sarah@")).toBe(false);
  expect(isValidEmail("")).toBe(false);
  expect(isValidEmail(999)).toBe(false);
});

test("validates password", () => {
  expect(isValidPassword("sarah12345")).toBe(true);
  expect(isValidPassword(999)).toBe(false);
  expect(isValidPassword("")).toBe(false);
  expect(isValidPassword(" ")).toBe(false);
});

test("validates user payload", () => {
  expect(isUserPayload({})).toBe(false);
  expect(isUserPayload(null)).toBe(false);
});

test("rejects an invalid secret key", () => {
  expect(getEnvironmentKey("MISSING_SECRET")).toBe("");
});