import { NextResponse } from "next/server";
import { authenticateLocalUser, attachSessionCookie } from "@/lib/auth";
import { getClientIp, recordUserIp } from "@/lib/ip";
import { rateLimit } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  // Brute-force guard: 10 attempts per IP per 15 minutes.
  const rl = rateLimit(`login:${getClientIp(req)}`, 10, 15 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Too many attempts — try again in ${rl.retryAfterSec}s` },
      { status: 429 },
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const username = (body.username ?? "").trim();
  const password = body.password ?? "";

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  const user = await authenticateLocalUser(username, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  await recordUserIp(user.id, getClientIp(req));
  const res = NextResponse.json({ ok: true, user: { id: user.id, username: user.username, role: user.role } });
  attachSessionCookie(res, user.id);
  return res;
}
