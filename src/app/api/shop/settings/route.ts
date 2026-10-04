import { getCurrentUser } from "@/lib/auth";
import { getOwnerLtcAddress, getOwnerLtcKeyphrase, setOwnerLtcAddress, setOwnerLtcKeyphrase } from "@/lib/shop";
import { refreshDiscordPanels } from "@/lib/eventLog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  const [ownerAddress, ownerLtcKeyphrase] = await Promise.all([
    getOwnerLtcAddress(),
    getOwnerLtcKeyphrase(),
  ]);
  return Response.json({ ownerLtcAddress: ownerAddress, ownerLtcKeyphrase });
}

export async function POST(req: Request) {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { ownerLtcAddress, ownerLtcKeyphrase } = body;
    if (!ownerLtcAddress || typeof ownerLtcAddress !== "string" || ownerLtcAddress.length < 10) {
      return Response.json({ error: "Invalid LTC address" }, { status: 400 });
    }
    if (typeof ownerLtcKeyphrase !== "undefined" && typeof ownerLtcKeyphrase !== "string") {
      return Response.json({ error: "Invalid LTC keyphrase" }, { status: 400 });
    }
    const address = ownerLtcAddress.trim();
    const keyphrase = typeof ownerLtcKeyphrase === "string" ? ownerLtcKeyphrase.trim() : await getOwnerLtcKeyphrase();
    await Promise.all([
      setOwnerLtcAddress(address),
      setOwnerLtcKeyphrase(keyphrase),
    ]);
    refreshDiscordPanels();
    return Response.json({ ok: true, ownerLtcAddress: address, ownerLtcKeyphrase: keyphrase });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
