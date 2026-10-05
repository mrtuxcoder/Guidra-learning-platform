const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const AI_REQUEST_TIMEOUT_MS = Number(
  process.env.AI_REQUEST_TIMEOUT_MS || 30000
);

// ====== GROQ MODELS (BEST FIRST) ======
const GROQ_MODELS = [
  "qwen/qwen3.8-27b", // Primary model available to the configured Groq key
  // "mixtral-8x7b-instruct",    // strong fallback, long context
  // "llama-3.1-8b-instant"      // fast fallback for small tasks
];

// ====== GEMINI MODELS ======
const GEMINI_MODELS = ["gemini-3.8-flash"];

// ====== HUGGINGFACE MODELS ======
const HUGGINGFACE_MODELS = [
  "openai/gpt-oss-120b",
  "meta-llama/Llama-3.1-8B-Instruct",
];

const AI_HEALTH_PROMPT = "Reply with the single word OK.";

const getProviderError = (error) => {
  const status = error.response?.status;
  const responseData = error.response?.data;
  const detail =
    responseData?.error?.message ||
    responseData?.error ||
    responseData?.message ||
    error.message;

  return `${status ? `HTTP ${status}: ` : ""}${detail}`;
};

/* ------------------------------------------------------------
   1) GROQ: Highest priority
------------------------------------------------------------ */
async function callGroqAPI(prompt, index = 0, allowFallback = true) {
  const model = GROQ_MODELS[index];

  try {
    console.log(`🚀 Trying Groq: ${model}`);

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 3000,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: AI_REQUEST_TIMEOUT_MS,
      }
    );

    return response.data.choices?.[0]?.message?.content;
  } catch (error) {
    console.warn(`❌ Groq ${model} failed:`, error.message);

    if (allowFallback && index < GROQ_MODELS.length - 1) {
      return callGroqAPI(prompt, index + 1, allowFallback);
    }

    throw new Error(getProviderError(error));
  }
}

/* ------------------------------------------------------------
   2) GEMINI (2nd priority)
------------------------------------------------------------ */
async function callGeminiAPI(prompt, index = 0, allowFallback = true) {
  const model = GEMINI_MODELS[index];

  try {
    console.log(`⚡ Trying Gemini: ${model}`);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(
      url,
      { contents: [{ parts: [{ text: prompt }] }] },
      { timeout: AI_REQUEST_TIMEOUT_MS }
    );

    return response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.warn(`❌ Gemini ${model} failed:`, error.message);

    if (allowFallback && index < GEMINI_MODELS.length - 1) {
      return callGeminiAPI(prompt, index + 1, allowFallback);
    }

    throw new Error(getProviderError(error));
  }
}

/* ------------------------------------------------------------
   3) HUGGINGFACE CHAT (3rd priority)
------------------------------------------------------------ */
async function callHFChat(prompt, index = 0, allowFallback = true) {
  const model = HUGGINGFACE_MODELS[index];

  try {
    console.log(`🌐 Trying HF Chat: ${model}`);

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 3500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
        },
        timeout: AI_REQUEST_TIMEOUT_MS,
      }
    );

    return response.data.choices?.[0]?.message?.content;
  } catch (error) {
    console.warn(`❌ HF Chat ${model} failed`);

    if (allowFallback && index < HUGGINGFACE_MODELS.length - 1) {
      return callHFChat(prompt, index + 1, allowFallback);
    }

    throw new Error(getProviderError(error));
  }
}

/* ------------------------------------------------------------
   4) HUGGINGFACE TEXT GENERATION (worst)
------------------------------------------------------------ */
async function callHFText(prompt, index = 0, allowFallback = true) {
  const model = HUGGINGFACE_MODELS[index];

  try {
    console.log(`📝 Trying HF Text: ${model}`);

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 3000,
        temperature: 0.7,
      },
      {
        headers: { Authorization: `Bearer ${HUGGINGFACE_TOKEN}` },
        timeout: AI_REQUEST_TIMEOUT_MS,
      }
    );

    return response.data.choices?.[0]?.message?.content;
  } catch (error) {
    console.warn(`❌ HF Text ${model} failed`);

    if (allowFallback && index < HUGGINGFACE_MODELS.length - 1) {
      return callHFText(prompt, index + 1, allowFallback);
    }

    throw new Error(getProviderError(error));
  }
}

const providerHealthChecks = [
  ...GROQ_MODELS.map((model, index) => ({
    provider: "groq-chat",
    model,
    key: "GROQ_API_KEY",
    run: () => callGroqAPI(AI_HEALTH_PROMPT, index, false),
  })),
  ...GEMINI_MODELS.map((model, index) => ({
    provider: "gemini",
    model,
    key: "GEMINI_API_KEY",
    run: () => callGeminiAPI(AI_HEALTH_PROMPT, index, false),
  })),
  ...HUGGINGFACE_MODELS.map((model, index) => ({
    provider: "huggingface-chat",
    model,
    key: "HUGGINGFACE_TOKEN",
    run: () => callHFChat(AI_HEALTH_PROMPT, index, false),
  })),
  ...HUGGINGFACE_MODELS.map((model, index) => ({
    provider: "huggingface-text",
    model,
    key: "HUGGINGFACE_TOKEN",
    run: () => callHFText(AI_HEALTH_PROMPT, index, false),
  })),
];

async function checkAIProviders() {
  const results = [];

  for (const check of providerHealthChecks) {
    const startedAt = Date.now();

    if (!process.env[check.key]?.trim()) {
      results.push({
        provider: check.provider,
        model: check.model,
        ok: false,
        latencyMs: 0,
        error: `${check.key} is missing or empty`,
      });
      continue;
    }

    try {
      const response = await check.run();
      results.push({
        provider: check.provider,
        model: check.model,
        ok: typeof response === "string" && response.trim().length > 0,
        latencyMs: Date.now() - startedAt,
      });
    } catch (error) {
      results.push({
        provider: check.provider,
        model: check.model,
        ok: false,
        latencyMs: Date.now() - startedAt,
        error: error.message,
      });
    }
  }

  return results;
}

/* ------------------------------------------------------------
   FINAL MASTER FUNCTION
------------------------------------------------------------ */
async function callAIAPI(prompt) {
  if (!prompt || prompt.trim().length < 3) {
    return "Please provide a more meaningful topic.";
  }

  const clean = prompt.trim();

  const pipeline = [
    () => callGroqAPI(clean), // BEST
    () => callGeminiAPI(clean), // SECOND
    () => callHFChat(clean), // THIRD
    () => callHFText(clean), // WORST
  ];

  for (const fn of pipeline) {
    try {
      const res = await fn();
      if (res) return res;
    } catch {
      continue;
    }
  }

  const error = new Error("All AI providers failed");
  error.statusCode = 503;
  throw error;
}

module.exports = callAIAPI;
module.exports.checkAIProviders = checkAIProviders;
