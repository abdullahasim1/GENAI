type HuggingFaceTextGenResponse =
  | Array<{ generated_text?: string }>
  | { generated_text?: string }
  | { error?: string; estimated_time?: number };

function getHfToken() {
  return (
    process.env.HF_API_KEY ||
    process.env.HUGGINGFACE_API_KEY ||
    process.env.HUGGINGFACEHUB_API_TOKEN ||
    ""
  );
}

export function hasHfConfig() {
  return Boolean(getHfToken());
}

export function getDefaultHfModel() {
  return process.env.HF_TEXT_MODEL || "google/flan-t5-large";
}

export async function hfGenerateText(prompt: string, model?: string) {
  const token = getHfToken();
  if (!token) {
    throw new Error("Missing Hugging Face API token (HF_API_KEY).");
  }

  const selectedModel = model || getDefaultHfModel();
  const res = await fetch(
    `https://api-inference.huggingface.co/models/${encodeURIComponent(
      selectedModel
    )}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 700,
          temperature: 0.4,
          return_full_text: false,
        },
      }),
    }
  );

  const data = (await res.json()) as HuggingFaceTextGenResponse;

  if (!res.ok) {
    const maybeErr =
      typeof data === "object" && data && "error" in data ? data.error : null;
    throw new Error(maybeErr || `HF request failed (${res.status})`);
  }

  if (Array.isArray(data)) {
    return data[0]?.generated_text || "";
  }

  if (data && typeof data === "object" && "generated_text" in data) {
    return data.generated_text || "";
  }

  return "";
}

export function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    // Try to extract the first JSON object substring.
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      const slice = text.slice(start, end + 1);
      return JSON.parse(slice);
    }
    throw new Error("Invalid JSON from model output.");
  }
}

export async function hfGenerateJson(prompt: string, model?: string) {
  const text = await hfGenerateText(prompt, model);
  return safeJsonParse(text);
}

