// The demo day. The Stern household is fictional and nobody replies to it, so
// on the public site the wall would sit at "scheduled" forever. This store
// plays the household's day on a clock: the sends go out at their real send
// time, and replies arrive at plausible minutes after, deterministically, only
// for orders the engine actually allowed (a held Friday send gets no reply,
// because nobody received anything).
//
// The engine does not know this exists. It reads events; these are events.
// Anything a visitor writes (a resolved need, a release) lands in memory on
// top and lasts as long as the instance does.

import { planSends } from "../engine/src/engine.ts";
import { parseReply } from "../engine/src/replies.ts";
import { atHouseholdTime, localParts } from "../engine/src/calendar.ts";
import { MemoryStore, type EventStore, type HouseholdEvent } from "../engine/src/store.ts";

/** Minutes after the send, and what comes back. Section numbers follow the bundled numbering. */
const SCRIPT: Array<{ after: number; text: string }> = [
  { after: 2, text: "Ver mi rutina" },
  { after: 35, text: "1 LISTO" },
  { after: 80, text: "2 LISTO" },
  { after: 130, text: "FALTA velas" },
  { after: 175, text: "PREGUNTA donde va el comino" },
  { after: 240, text: "3 LISTO" },
  { after: 300, text: "4 LISTO" },
  { after: 380, text: "FALTA papel pergamino" },
  { after: 420, text: "5 LISTO" },
  { after: 470, text: "6 LISTO" },
];

export class DemoDayStore implements EventStore {
  readonly name = "demo-day";
  readonly durable = false;
  private readonly extra = new MemoryStore();
  private readonly now: () => Date;
  constructor(now: () => Date = () => new Date()) {
    this.now = now;
  }

  private async scripted(): Promise<HouseholdEvent[]> {
    const now = this.now();
    const { date } = localParts(now);
    const plans = await planSends(now);
    const out: HouseholdEvent[] = [];
    const byWorker = new Map<string, { sendAt: Date; orders: string[]; sections: number }>();

    for (const p of plans) {
      if (p.suppressed) continue;
      const sendAt = atHouseholdTime(p.order.date, p.order.sendAt);
      if (sendAt > now) continue;
      const w = byWorker.get(p.order.assignee) ?? { sendAt, orders: [], sections: 0 };
      w.orders.push(p.order.id);
      w.sections += p.order.sections.length;
      byWorker.set(p.order.assignee, w);
      out.push({ ts: sendAt.toISOString(), type: "sent", date, orderId: p.order.id, workerId: p.order.assignee, text: "released (demo day)" });
    }

    for (const [workerId, w] of byWorker) {
      let confirmed = 0;
      for (const step of SCRIPT) {
        const ts = new Date(w.sendAt.getTime() + step.after * 60_000);
        if (ts > now) break;
        const reply = parseReply(step.text);
        if (reply.kind === "done") {
          confirmed++;
          if (confirmed > w.sections) continue; // this worker has fewer sections today
        }
        out.push({ ts: ts.toISOString(), type: "reply", date, workerId, orderId: w.orders[0], reply });
      }
    }
    return out;
  }

  async read(): Promise<HouseholdEvent[]> {
    const all = [...(await this.scripted()), ...(await this.extra.read())];
    return all.sort((a, b) => a.ts.localeCompare(b.ts));
  }
  async append(e: HouseholdEvent): Promise<void> {
    await this.extra.append(e);
  }
}
