"use server";

import { db } from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  verifyPasscode,
  createUnlockToken,
  unlockCookieName,
} from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function unlockCollection(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const code = String(formData.get("code") ?? "");
  const redirectOverride = String(formData.get("redirectOverride") ?? "");

  const [collection] = await db
    .select()
    .from(collections)
    .where(eq(collections.slug, slug))
    .limit(1);

  if (!collection || !collection.passcodeHash) {
    redirect(`/collections/${slug}`);
  }

  const ok = await verifyPasscode(code, collection.passcodeHash);
  if (!ok) {
    redirect(`/collections/${slug}?error=1`);
  }

  const { value, expires } = createUnlockToken(slug);
  const store = await cookies();
  store.set(unlockCookieName(slug), value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires,
    path: "/",
  });

  redirect(redirectOverride || `/collections/${slug}`);
}
