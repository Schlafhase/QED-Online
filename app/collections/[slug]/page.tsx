import { db } from "@/lib/db/client";
import { articles, collections } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyUnlockToken, unlockCookieName } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { unlockCollection } from "./actions";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const { error } = await searchParams;

  const [collection] = await db
    .select()
    .from(collections)
    .where(eq(collections.slug, slug))
    .limit(1);

  if (!collection) notFound();

  const store = await cookies();
  const isLocked = Boolean(collection.passcodeHash);
  const isUnlocked =
    !isLocked || verifyUnlockToken(slug, store.get(unlockCookieName(slug))?.value);

  if (isLocked && !isUnlocked) {
    return (
      <main className="mx-auto w-full max-w-md px-6 py-24">
        <h1 className="text-2xl font-bold mb-2">{collection.title}</h1>
        <p className="mb-6" style={{ color: "var(--ink-soft)" }}>
          This collection is locked. Enter the code to view it.
        </p>
        <form action={unlockCollection} className="flex gap-2">
          <input type="hidden" name="slug" value={slug} />
          <input
            type="password"
            name="code"
            placeholder="Code"
            autoFocus
            className="flex-1 rounded border px-3 py-2"
            style={{ borderColor: "var(--line)" }}
          />
          <button
            type="submit"
            className="rounded px-4 py-2 text-white"
            style={{ background: "var(--accent)" }}
          >
            Unlock
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">Incorrect code, try again.</p>}
      </main>
    );
  }

  const collectionArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.collectionId, collection.id))
    .orderBy(desc(articles.publishedAt));

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">{collection.title}</h1>
        {collection.description && (
          <p className="mt-2" style={{ color: "var(--ink-soft)" }}>
            {collection.description}
          </p>
        )}
      </header>

      {collectionArticles.length === 0 ? (
        <p style={{ color: "var(--ink-soft)" }}>No articles in this collection yet.</p>
      ) : (
        <ul className="space-y-3">
          {collectionArticles.map((a) => (
            <li key={a.id} className="border-b pb-3" style={{ borderColor: "var(--line)" }}>
              <Link href={`/articles/${a.slug}`} className="font-medium hover:underline">
                {a.title}
              </Link>
              {a.excerpt && (
                <p className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>
                  {a.excerpt}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
