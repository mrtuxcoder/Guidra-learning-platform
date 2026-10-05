const test = require("node:test");
const assert = require("node:assert/strict");

process.env.JWT_SECRET = "test-secret-with-at-least-32-characters-long";
process.env.JWT_EXPIRES_IN = "7d";

const { signJwt, verifyJwt } = require("../configs/jwt");
const { getTokenCookieOptions } = require("../controllers/auth-controllers/set-token-cookie");

test("JWTs are signed and verified with the configured secret", () => {
  const token = signJwt({ id: "user-id" });
  assert.equal(verifyJwt(token).id, "user-id");
});

test("authentication cookie is HttpOnly and same-site", () => {
  process.env.NODE_ENV = "production";
  const options = getTokenCookieOptions();

  assert.equal(options.httpOnly, true);
  assert.equal(options.secure, true);
  assert.equal(options.sameSite, "lax");
});
