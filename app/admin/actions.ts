"use server";

import { db } from "@/lib/db/client";
import { articles, collections } from "@/lib/db/schema";
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
import { parseFrontmatter, renderMarkdown } from "@/lib/markdown";
import { DEFAULT_COLLECTION_SLUG } from "@/lib/defaultCollection";

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

export async function createCollection(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const passcode = String(formData.get("passcode") ?? "").trim();

  if (!title || !slug) redirect("/admin?error=missing-fields");

  await db.insert(collections).values({
    id: nanoid(),
    title,
    slug,
    description: description || null,
    passcodeHash: passcode ? await hashPasscode(passcode) : null,
  });

  redirect("/admin?created=collection");
}

export async function uploadArticle(formData: FormData) {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  const pastedMarkdown = String(formData.get("markdown") ?? "");
  const collectionId =
    String(formData.get("collectionId") ?? DEFAULT_COLLECTION_SLUG) ||
    DEFAULT_COLLECTION_SLUG;

  console.log(collectionId);
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

  const raw = file && file.size > 0 ? await file.text() : pastedMarkdown;
  if (!raw.trim()) redirect("/admin?error=empty");

  const { frontmatter, body } = parseFrontmatter(raw);

  const title = String(frontmatter.title ?? "Untitled");
  const slug =
    String(frontmatter.slug ?? "") ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  const excerpt = frontmatter.excerpt ? String(frontmatter.excerpt) : null;

  const html = await renderMarkdown(body);

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
        excerpt,
        markdownBody: body,
        renderedHtml: html,
        collectionId,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, existing.id));
  } else {
    await db.insert(articles).values({
      id: nanoid(),
      slug,
      title,
      excerpt,
      markdownBody: body,
      renderedHtml: html,
      collectionId,
    });
  }

  redirect(`/admin?published=${slug}`);
}
