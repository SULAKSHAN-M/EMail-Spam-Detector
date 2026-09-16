// Shared Gemini API client with automatic model fallback.
const https = require('https');

const GEMINI_HOST = 'generativelanguage.googleapis.com';
const REQUEST_TIMEOUT_MS = 30_000;

// Ordered best quality → most available
const MODEL_CHAIN = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];

// Models that support thinking mode — disable for chat/summary tasks
const THINKING_MODELS = new Set(['gemini-2.5-flash', 'gemini-2.5-pro']);

function httpsPost(model, apiKey, body) {
  return new Promise((resolve, reject) => {
    const path = `/v1beta/models/${model}:generateContent?key=${apiKey}`;

    let finalBody = body;
    if (THINKING_MODELS.has(model)) {
      finalBody = {
        ...body,
        generationConfig: {
          ...body.generationConfig,
          thinkingConfig: { thinkingBudget: 0 },
        },
      };
    }

    const data = JSON.stringify(finalBody);
    const options = {
      hostname: GEMINI_HOST,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          if (res.statusCode === 429 || res.statusCode === 404) {
            if (res.statusCode === 404) {
              console.warn(`[Gemini] ${model} returned 404 — skipping`);
            }
            reject(
              Object.assign(new Error('RATE_LIMITED_OR_NOT_FOUND'), {
                isRateLimit: true,
                model,
              }),
            );
          } else if (res.statusCode >= 400) {
            reject(new Error(`Gemini ${res.statusCode} (${model}): ${raw.slice(0, 300)}`));
          } else {
            resolve({ data: parsed, model });
          }
        } catch {
          reject(new Error(`Parse error from ${model}: ${raw.slice(0, 200)}`));
        }
      });
    });

    req.setTimeout(REQUEST_TIMEOUT_MS, () => {
      req.destroy(new Error(`Request timeout after ${REQUEST_TIMEOUT_MS}ms`));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function geminiGenerate(body, startModel) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const chain = startModel
    ? [startModel, ...MODEL_CHAIN.filter((m) => m !== startModel)]
    : MODEL_CHAIN;

  let lastError;

  for (const model of chain) {
    try {
      const { data, model: usedModel } = await httpsPost(model, apiKey, body);
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error(`Empty response from ${usedModel}`);

      if (usedModel !== chain[0]) {
        console.log(`[Gemini] Fallback used: ${usedModel}`);
      }

      return { text: text.trim(), model: usedModel };
    } catch (err) {
      if (err.isRateLimit) {
        console.warn(`[Gemini] ${model} unavailable — trying next`);
        lastError = err;
        continue;
      }
      throw err;
    }
  }

  const allLimited = new Error('ALL_MODELS_RATE_LIMITED');
  allLimited.isRateLimit = true;
  throw allLimited;
}

module.exports = { geminiGenerate, MODEL_CHAIN };
