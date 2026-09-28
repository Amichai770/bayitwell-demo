import Anthropic from "@anthropic-ai/sdk";
import type { VercelRequest, VercelResponse } from "@vercel/node";

/* The study companion. Only this file talks to the Claude API; the key never reaches the phone. */

const RULES = `You are the study companion inside Mishmeret, a learning community for Kohanim created by Rabbi Amichai Cohen of Live Kabbalah. Answer only questions about the Kehuna: the Kohanim, Birkat Kohanim, the Beit HaMikdash and its avodah, the Rambam's Hilchot Beit HaBechira and related laws, and the inner meaning of the priesthood in Chassidus and Kabbalah. Ground every answer in named sources (a Torah verse with chapter and verse, Mishnah, Talmud, Rambam with the name of the halachot and chapter, Zohar, Tanya) and name them inline in the prose. Distinguish clearly between plain meaning, halacha, commentary, and inner teaching. Never rule on a personal halachic question. If a question is practical and personal (may I attend this funeral, may I marry this person, what should I do), state the general principle in one or two sentences and tell the person to bring the actual case to their rav. If you are not sure of a source, say so plainly rather than inventing one. Write G-d with a hyphen. Do not use contractions. No bullet lists, no headings. Warm, plain, grounded prose, at most 170 words. Finish with one line beginning "Sources:" listing what you drew on. If the question is outside the Kehuna, say gently that this companion only studies the Kehuna and offer one related direction.`;

const client = new Anthropic();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "GET") {
    res.status(200).json({ ok: Boolean(process.env.ANTHROPIC_API_KEY) });
    return;
  }
  if (req.method !== "POST") { res.status(405).json({ error: "method not allowed" }); return; }
  if (!process.env.ANTHROPIC_API_KEY) { res.status(503).json({ error: "companion not configured" }); return; }

  const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) || {};
  const raw: unknown = body.messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 12) { res.status(400).json({ error: "messages required" }); return; }
  const messages: Anthropic.MessageParam[] = [];
  for (const m of raw) {
    const role = m && m.role === "assistant" ? "assistant" : "user";
    const content = typeof (m && m.content) === "string" ? String(m.content).slice(0, 2000) : "";
    if (content) messages.push({ role, content });
  }
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") { res.status(400).json({ error: "last message must be from the user" }); return; }

  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 1024, // replies are capped at about 170 words by the instructions
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: [{ type: "text", text: RULES, cache_control: { type: "ephemeral" } }],
      messages,
    });
    if (response.stop_reason === "refusal") {
      res.status(200).json({ text: "The companion cannot answer that one here. Please bring it to your rav." });
      return;
    }
    const text = response.content.filter((b) => b.type === "text").map((b) => (b as Anthropic.TextBlock).text).join("\n").trim();
    res.status(200).json({ text: text || "The companion had nothing to add. Please ask again another way." });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) { res.status(429).json({ error: "rate limited" }); return; }
    if (error instanceof Anthropic.AuthenticationError) { res.status(503).json({ error: "companion not configured" }); return; }
    if (error instanceof Anthropic.APIError) { res.status(502).json({ error: `api error ${error.status}` }); return; }
    res.status(500).json({ error: "unexpected error" });
  }
}
