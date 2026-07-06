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
  params: Promise<{ collectionSlug: string }>;
  searchParams: Promise<{ error?: string; redirectArticle?: string }>;
}) {
  const { collectionSlug } = await params;
  const { error, redirectArticle } = await searchParams;

  const [collection] = await db
    .select()
    .from(collections)
    .where(eq(collections.slug, collectionSlug))
    .limit(1);

  if (!collection) notFound();

  const store = await cookies();
  const isLocked = Boolean(collection.passcodeHash);
  const isUnlocked =
    !isLocked ||
    verifyUnlockToken(
      collectionSlug,
      store.get(unlockCookieName(collectionSlug))?.value,
    );

  if (isLocked && !isUnlocked) {
    return (
      <main>
        <h1>{collection.title}</h1>
        <p>This collection is locked. Enter the code to view it.</p>
        <form action={unlockCollection}>
          {redirectArticle && (
            <input
              type="hidden"
              name="redirectOverride"
              value={`/collections/${collectionSlug}/${redirectArticle}`}
            />
          )}
          <input type="hidden" name="slug" value={collectionSlug} />
          <input type="password" name="code" placeholder="Code" autoFocus />
          <button type="submit">Unlock</button>
        </form>
        {error && <p>Incorrect code, try again.</p>}
      </main>
    );
  }

  const collectionArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.collectionId, collection.id))
    .orderBy(desc(articles.publishedAt));

  return (
    <main>
      <header>
        <h1>{collection.title}</h1>
        {collection.description && <p>{collection.description}</p>}
      </header>

      {collectionArticles.length === 0 ? (
        <p>No articles in this collection yet.</p>
      ) : (
        <ul>
          {collectionArticles.map((a) => (
            <li key={a.id}>
              <Link href={`/collections/${collectionSlug}/${a.slug}`}>
                {a.title}
              </Link>
              {a.excerpt && <p>{a.excerpt}</p>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
