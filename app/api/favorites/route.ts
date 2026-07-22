import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { favorites } from "../../../db/schema";

export async function GET(request: Request) {
  const deviceId = new URL(request.url).searchParams.get("deviceId");
  if (!deviceId) return NextResponse.json({ favorites: [] });
  const rows = await getDb().select({ placeId: favorites.placeId }).from(favorites).where(eq(favorites.deviceId, deviceId));
  return NextResponse.json({ favorites: rows.map((row) => row.placeId) });
}

export async function POST(request: Request) {
  const body = await request.json() as { deviceId?: string; placeId?: string; active?: boolean };
  if (!body.deviceId || !body.placeId) return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  const db = getDb();
  if (body.active) {
    await db.insert(favorites).values({ deviceId: body.deviceId, placeId: body.placeId, createdAt: new Date().toISOString() }).onConflictDoNothing();
  } else {
    await db.delete(favorites).where(and(eq(favorites.deviceId, body.deviceId), eq(favorites.placeId, body.placeId)));
  }
  return NextResponse.json({ ok: true });
}
