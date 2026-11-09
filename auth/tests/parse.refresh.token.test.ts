import { test, expect } from "@jest/globals";

import { parseRefreshToken } from "../../shared/src/helpers/shared.helper.js";

test("parses a refresh token", () => {
  expect(parseRefreshToken("")).toBeNull();
});