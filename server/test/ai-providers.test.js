const test = require("node:test");
const assert = require("node:assert/strict");
const dotenv = require("dotenv");

const nodeEnv = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${nodeEnv}` });
dotenv.config();

const { checkAIProviders } = require("../utils/call-AI");

test(
  "configured AI provider keys and models respond",
  { skip: process.env.RUN_AI_PROVIDER_TESTS !== "1", timeout: 180000 },
  async () => {
    const results = await checkAIProviders();

    for (const result of results) {
      console.log(
        `${result.ok ? "PASS" : "FAIL"} ${result.provider}/${result.model} (${result.latencyMs}ms)${
          result.error ? `: ${result.error}` : ""
        }`
      );
    }

    assert.equal(
      results.length > 0,
      true,
      "No AI provider models are configured"
    );
    assert.equal(
      results.every((result) => result.ok),
      true,
      "One or more AI provider keys/models failed; see the provider output above"
    );
  }
);