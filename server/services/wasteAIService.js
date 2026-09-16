const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const DEFAULT_GROQ_MODEL = process.env.GROQ_VISION_MODEL || "qwen/qwen3.6-27b";

const PROMPT = `You are a quality-control expert in a commercial printing house.
Analyze the attached photo of damaged/wasted printed paper and classify the most likely root cause.

Allowed decisions:
- "Machine": printer/mechanical/ink/feeding issue such as lines, smudges, fading, toner/ink defects, paper-jam damage, skew caused by the machine.
- "Employee": clear human/setup error such as wrong orientation, wrong size/settings, accidental duplicate printing, wrong file/setup.
- "Unknown": the image is insufficient or the cause cannot be determined reliably.

Return ONLY valid JSON with exactly these fields:
{"decision":"Machine|Employee|Unknown","explanation":"تشخيص عربي قصير وواضح"}

Do not blame an employee unless the visual evidence clearly supports it.`;

function normalizeAnalysis(value) {
  if (!value || typeof value !== "object") {
    throw new Error("AI returned an invalid JSON object");
  }

  const allowed = new Set(["Machine", "Employee", "Unknown"]);
  const decision = allowed.has(value.decision) ? value.decision : "Unknown";
  const explanation = String(value.explanation || "تعذر تحديد سبب واضح من الصورة").trim();

  return { decision, explanation };
}

function parseJsonText(text) {
  const cleaned = String(text || "")
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return normalizeAnalysis(JSON.parse(cleaned));
  } catch (error) {
    // Defensive fallback for providers that wrap JSON in extra text.
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return normalizeAnalysis(JSON.parse(cleaned.slice(start, end + 1)));
    }
    throw error;
  }
}

async function fetchWithTimeout(url, options, timeoutMs = 20000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function analyzeWithGemini(buffer, mimeType) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const model = DEFAULT_GEMINI_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  const response = await fetchWithTimeout(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            { text: PROMPT },
            {
              inlineData: {
                mimeType,
                data: buffer.toString("base64"),
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    }),
  });

  const raw = await response.text();
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    throw new Error(`Gemini returned a non-JSON HTTP response (${response.status})`);
  }

  if (!response.ok) {
    const message = payload?.error?.message || `HTTP ${response.status}`;
    throw new Error(`Gemini API error: ${message}`);
  }

  const text = payload?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) throw new Error("Gemini returned an empty analysis");
  return { ...parseJsonText(text), provider: "Gemini" };
}

async function analyzeWithGroq(buffer, mimeType) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured");

  // Lazy import so Gemini-only installations do not fail at startup.
  const Groq = require("groq-sdk");
  const groq = new Groq({ apiKey });
  const imageUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

  const completion = await groq.chat.completions.create({
    model: DEFAULT_GROQ_MODEL,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: PROMPT },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
    max_completion_tokens: 300,
  });

  const text = completion?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Groq returned an empty analysis");
  return { ...parseJsonText(text), provider: "Groq" };
}

async function analyzeWasteImage(buffer, mimeType) {
  const preferred = String(process.env.AI_PROVIDER || "gemini").toLowerCase();
  const providers = preferred === "groq"
    ? [analyzeWithGroq, analyzeWithGemini]
    : [analyzeWithGemini, analyzeWithGroq];

  const errors = [];
  for (const provider of providers) {
    try {
      if (provider === analyzeWithGemini && !process.env.GEMINI_API_KEY) continue;
      if (provider === analyzeWithGroq && !process.env.GROQ_API_KEY) continue;
      return await provider(buffer, mimeType);
    } catch (error) {
      errors.push(error.message);
    }
  }

  if (!errors.length) {
    throw new Error("No AI provider is configured. Set GEMINI_API_KEY or GROQ_API_KEY.");
  }
  throw new Error(errors.join(" | "));
}

module.exports = { analyzeWasteImage };
