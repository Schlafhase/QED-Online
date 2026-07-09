"use server";

import { db } from "@/lib/db/client";
import { articles, collections, editions } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  verifyAdminPassword,
  createAdminToken,
  verifyAdminToken,
  ADMIN_COOKIE_NAME,
  hashPasscode,
} from "@/lib/auth";
import { DEFAULT_COLLECTION_SLUG } from "@/lib/defaultCollection";
import { validSlug } from "@/lib/slug";
import { InvalidFieldError, MissingFieldError } from "@/lib/errors";
import { revalidatePath } from "next/cache";

export async function adminLogin(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!verifyAdminPassword(password)) {
    redirect("/admin?error=1");
  }
  const { name, value, expires } = createAdminToken();
  const store = await cookies();
  store.set(name, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires,
    path: "/",
  });
  redirect("/admin");
}

async function requireAdmin() {
  const store = await cookies();
  const ok = verifyAdminToken(store.get(ADMIN_COOKIE_NAME)?.value);
  if (!ok) redirect("/admin");
}
export async function createEdition(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const number = parseInt(String(formData.get("editionNumber") ?? "0"));
  const release = new Date(String(formData.get("release")));
  const passcode = String(formData.get("passcode") ?? "").trim();
  const id = nanoid();

  if (!title || !slug || number === 0 || release === null || !passcode)
    throw new MissingFieldError();
  if (!validSlug(slug)) throw new InvalidFieldError();

  await db.insert(editions).values({
    id: id,
    editionNo: number,
    releaseDate: release,
  });

  await db.insert(collections).values({
    id: nanoid(),
    editionId: id,
    title,
    slug,
    description: `Ausgabe Nr. ${number} - ${release.getFullYear()}`,
    passcodeHash: passcode ? await hashPasscode(passcode) : null,
  });

  revalidatePath("/admin");
}

export async function createCollection(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const passcode = String(formData.get("passcode") ?? "").trim();

  if (!title || !slug) throw new MissingFieldError();
  if (!validSlug(slug)) throw new InvalidFieldError();

  await db.insert(collections).values({
    id: nanoid(),
    title,
    slug,
    description: description || null,
    passcodeHash: passcode ? await hashPasscode(passcode) : null,
  });
  revalidatePath("/admin");
}

export async function uploadArticle(formData: FormData) {
  await requireAdmin();

  const collectionId =
    String(formData.get("collectionId") ?? DEFAULT_COLLECTION_SLUG) ||
    DEFAULT_COLLECTION_SLUG;

  if (collectionId == DEFAULT_COLLECTION_SLUG) {
    const [defaultCollection] = await db
      .select()
      .from(collections)
      .where(eq(collections.id, DEFAULT_COLLECTION_SLUG))
      .limit(1);
    if (!defaultCollection) {
      await db.insert(collections).values({
        id: DEFAULT_COLLECTION_SLUG,
        slug: DEFAULT_COLLECTION_SLUG,
        title: DEFAULT_COLLECTION_SLUG,
      });
    }
  }

  const title = String(formData.get("title") ?? "") || "";
  const slug = String(formData.get("slug") ?? "") || "";
  if (!title || !slug) throw new MissingFieldError();
  if (!validSlug(slug)) throw new InvalidFieldError();

  const html = String(formData.get("html") ?? "") || "";
  const plainText = String(formData.get("text") ?? "") || "";
  const showDate = formData.get("showDate") === "on";

  if (!html || !plainText) {
    throw new MissingFieldError();
  }

  const [existing] = await db
    .select()
    .from(articles)
    .where(
      and(eq(articles.collectionId, collectionId), eq(articles.slug, slug)),
    )
    .limit(1);

  if (existing) {
    await db
      .update(articles)
      .set({
        title,
        plainText,
        renderedHtml: html,
        collectionId,
        showDate,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, existing.id));
  } else {
    await db.insert(articles).values({
      id: nanoid(),
      slug,
      title,
      plainText,
      renderedHtml: html,
      publishedAt: new Date(),
      collectionId,
      showDate,
    });
  }
}
