import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ favorites: [], migrated: true });
}

export async function POST() {
  return NextResponse.json({ error: "Les favoris sont maintenant liés au compte utilisateur." }, { status: 410 });
}
