import { rateLimitRequest } from "@/lib/ratelimit";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { invoices, shopPlans } from "@/db/schema";
import { and, desc, eq, lt } from "drizzle-orm";
import { calculateLtcAmount, generateLtcInvoiceAddress, getOwnerLtcAddress, createDefaultPlansIfEmpty, SHOP_INVOICE_TTL_MS } from "@/lib/shop";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type InvoiceRow = typeof invoices.$inferSelect;
type PlanRow = typeof shopPlans.$inferSelect;

function publicInvoice(invoice: InvoiceRow, plan?: PlanRow | null) {
  return {
    id: invoice.id,
    planId: invoice.planId,
    amountUSD: invoice.amountUSD,
    amountLTC: invoice.amountLTC,
    ltcAddress: invoice.ltcAddress,
    ownerLtcAddress: invoice.ownerLtcAddress,
    status: invoice.status,
    expiresAt: invoice.expiresAt,
    createdAt: invoice.createdAt,
    tier: plan?.tier,
    bots: plan?.bots,
    hours: plan?.hours,
    licenseKey: invoice.licenseKey,
  };
}

async function expireStaleInvoices(userId?: string) {
  const where = userId
    ? and(eq(invoices.status, "pending"), eq(invoices.userId, userId), lt(invoices.expiresAt, new Date()))
    : and(eq(invoices.status, "pending"), lt(invoices.expiresAt, new Date()));
  await db.update(invoices).set({ status: "expired" }).where(where);
}

export async function GET() {
  const me = await getCurrentUser();
  if (!me) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await expireStaleInvoices(me.role === "admin" ? undefined : me.id);
  
  if (me.role === "admin") {
    const all = await db.select().from(invoices).orderBy(desc(invoices.createdAt)).limit(100);
    return Response.json({ invoices: all });
  } else {
    const mine = await db.select().from(invoices).where(eq(invoices.userId, me.id)).orderBy(desc(invoices.createdAt)).limit(50);
    return Response.json({ invoices: mine.map((invoice) => publicInvoice(invoice)) });
  }
}

export async function POST(req: Request) {
  const limited = rateLimitRequest(req, "invoice-create", 10, 600000);
  if (limited) return limited;

  const me = await getCurrentUser();
  if (!me) {
    return Response.json({ error: "Not logged in - please login properly" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { planId } = body;
    if (!planId) return Response.json({ error: "planId required" }, { status: 400 });

    await createDefaultPlansIfEmpty();
    await expireStaleInvoices(me.id);

    const [existing] = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.userId, me.id), eq(invoices.status, "pending")))
      .orderBy(desc(invoices.createdAt))
      .limit(1);
    if (existing && new Date(existing.expiresAt).getTime() > Date.now()) {
      const plan = existing.planId
        ? (await db.select().from(shopPlans).where(eq(shopPlans.id, existing.planId)))[0]
        : null;
      return Response.json(
        {
          error: "You already have an active invoice. Finish or cancel it before creating a new one.",
          invoice: publicInvoice(existing, plan),
        },
        { status: 409 },
      );
    }

    const [plan] = await db.select().from(shopPlans).where(eq(shopPlans.id, planId));
    if (!plan || plan.active !== "true") {
      return Response.json({ error: "Plan not found or inactive" }, { status: 404 });
    }

    const finalPrice = Math.round(plan.price * (1 - plan.discount / 100) * 100) / 100;
    const { ltcAmount } = await calculateLtcAmount(finalPrice);
    const { address, privateKeyWif } = generateLtcInvoiceAddress();
    const ownerAddress = await getOwnerLtcAddress();

    const expiresAt = new Date(Date.now() + SHOP_INVOICE_TTL_MS);

    const [invoice] = await db.insert(invoices).values({
      userId: me.id,
      planId: plan.id,
      amountUSD: finalPrice,
      amountLTC: ltcAmount,
      ltcAddress: address,
      ltcPrivateKey: privateKeyWif,
      ownerLtcAddress: ownerAddress,
      status: "pending",
      expiresAt,
    }).returning();

    return Response.json({ invoice: publicInvoice(invoice, plan) });
  } catch (e) {
    console.error("Invoice create error", e);
    return Response.json({ error: e instanceof Error ? e.message : "Failed to create invoice" }, { status: 500 });
  }
}
