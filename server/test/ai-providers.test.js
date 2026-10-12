const test = require("node:test");
const assert = require("node:assert/strict");
const dotenv = require("dotenv");

const nodeEnv = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${nodeEnv}` });
dotenv.config();

const { checkAIProviders } = require("../utils/call-AI");

test(
  "configured AI providers are checked",
  { timeout: 180000 },
  async () => {
    const results = await checkAIProviders();

    for (const result of results) {
      console.log(
        `${result.ok ? "PASS" : "FAIL"} ${result.provider}/${result.model} (${result.latencyMs}ms)${
          result.error ? `: ${result.error}` : ""
        }`
      );
    }

    const working = results.filter((result) => result.ok);
    const unavailable = results.filter((result) => !result.ok);
    const providers = [...new Set(results.map((result) => result.provider))];
    const workingProviders = providers.filter((provider) =>
      results.some((result) => result.provider === provider && result.ok)
    );
    const reasons = new Map();

    for (const result of unavailable) {
      const reason = result.error || "empty response";
      reasons.set(reason, (reasons.get(reason) || 0) + 1);
    }

    const reasonSummary = [...reasons.entries()]
      .map(([reason, count]) => `${count}x ${reason}`)
      .join("; ");

    console.log(
      `AI summary: ${workingProviders.length}/${providers.length} providers working (${working.length}/${results.length} checks passed)` +
        (unavailable.length ? `; unavailable: ${reasonSummary}` : "")
    );

    assert.equal(
      results.length > 0,
      true,
      "No AI provider models are configured"
    );
    assert.equal(
      results.some((result) => result.ok),
      true,
      "No configured AI provider responded successfully; see the provider output above"
    );
  }
);