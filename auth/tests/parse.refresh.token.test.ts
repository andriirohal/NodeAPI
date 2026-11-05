import { test, expect } from "@jest/globals";

import { parseRefreshToken } from "../../shared/src/helpers/shared.helper.js";

test("parses a refresh token", () => {
  const response = parseRefreshToken("");
  
  expect(response).toBeNull();
});