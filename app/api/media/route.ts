import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { upload } from "@/lib/storage";

export async function POST(request: NextRequest) {
  const store = await cookies();
  const isAdmin = verifyAdminToken(store.get(ADMIN_COOKIE_NAME)?.value);
  if (!isAdmin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "no file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = await upload(buffer, file.type || "application/octet-stream");

  return NextResponse.json({ url: `${process.env.STORAGE_URL}${key}` });
}
