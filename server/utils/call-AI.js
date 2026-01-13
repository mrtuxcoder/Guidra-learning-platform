const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// ====== GROQ MODELS (BEST FIRST) ======
const GROQ_MODELS = [
  "llama-3.3-70b-versatile", // ⭐ best quality, main model
  // "mixtral-8x7b-instruct",    // strong fallback, long context
  // "llama-3.1-8b-instant"      // fast fallback for small tasks
];

// ====== GEMINI MODELS ======
const GEMINI_MODELS = ["gemini-2.0-flash"];

// ====== HUGGINGFACE MODELS ======
const HUGGINGFACE_MODELS = [
  "openai/gpt-oss-120b:fastest",
  "meta-llama/Meta-Llama-3-70B-Instruct",
];

/* ------------------------------------------------------------
   1) GROQ: Highest priority
------------------------------------------------------------ */
async function callGroqAPI(prompt, index = 0) {
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
      }
    );

    return response.data.choices?.[0]?.message?.content;
  } catch (error) {
    console.warn(`❌ Groq ${model} failed:`, error.message);

    if (index < GROQ_MODELS.length - 1) {
      return callGroqAPI(prompt, index + 1);
    }

    throw new Error("All Groq models failed");
  }
}

/* ------------------------------------------------------------
   2) GEMINI (2nd priority)
------------------------------------------------------------ */
async function callGeminiAPI(prompt, index = 0) {
  const model = GEMINI_MODELS[index];

  try {
    console.log(`⚡ Trying Gemini: ${model}`);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.warn(`❌ Gemini ${model} failed:`, error.message);

    if (index < GEMINI_MODELS.length - 1) {
      return callGeminiAPI(prompt, index + 1);
    }

    throw new Error("All Gemini models failed");
  }
}

/* ------------------------------------------------------------
   3) HUGGINGFACE CHAT (3rd priority)
------------------------------------------------------------ */
async function callHFChat(prompt, index = 0) {
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
      }
    );

    return response.data.choices?.[0]?.message?.content;
  } catch (error) {
    console.warn(`❌ HF Chat ${model} failed`);

    if (index < HUGGINGFACE_MODELS.length - 1) {
      return callHFChat(prompt, index + 1);
    }

    throw new Error("All HF Chat models failed");
  }
}

/* ------------------------------------------------------------
   4) HUGGINGFACE TEXT GENERATION (worst)
------------------------------------------------------------ */
async function callHFText(prompt, index = 0) {
  const model = HUGGINGFACE_MODELS[index];

  try {
    console.log(`📝 Trying HF Text: ${model}`);

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 3000,
          temperature: 0.7,
        },
      },
      {
        headers: { Authorization: `Bearer ${HUGGINGFACE_TOKEN}` },
      }
    );

    return response.data?.[0]?.generated_text || "HF generated no text.";
  } catch (error) {
    console.warn(`❌ HF Text ${model} failed`);

    if (index < HUGGINGFACE_MODELS.length - 1) {
      return callHFText(prompt, index + 1);
    }

    throw new Error("All HF Text models failed");
  }
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

  return "AI services are temporarily unavailable. Please try again shortly.";
}

module.exports = callAIAPI;
