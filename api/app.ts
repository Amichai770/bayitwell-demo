// The Bayitwell service on Vercel. One function carries the whole engine:
// the live Command Center at /live, the API under /api, and the WhatsApp
// webhook at /webhook. The engine itself is vendored into ./engine at deploy
// time from the private repository; it is not part of this public demo repo.

import type { IncomingMessage, ServerResponse } from "node:http";
import { createApp, chooseTransport, chooseModel } from "../engine/src/serve.ts";
import { chooseStore } from "../engine/src/store.ts";
import { DemoDayStore } from "./demo-day.ts";

// DEMO_DAY=1 plays the fictional household's day on a clock; otherwise the
// real store, whatever the host provides.
const store = process.env.DEMO_DAY === "1" ? new DemoDayStore() : chooseStore();
const app = createApp({ store, transport: chooseTransport() }, process.env, chooseModel());

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // vercel.json rewrites carry the original path in ?p= so the engine's own
  // router sees the URL the visitor typed.
  const u = new URL(req.url ?? "/", "http://localhost");
  const p = u.searchParams.get("p");
  if (p) {
    u.searchParams.delete("p");
    req.url = p + (u.search || "");
  }
  return app(req, res);
}
