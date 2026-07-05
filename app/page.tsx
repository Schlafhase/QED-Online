import Link from "next/link";
import { db } from "@/lib/db/client";
import { articles, collections } from "@/lib/db/schema";
import { isNull, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allCollections = await db.select().from(collections);
  const standaloneArticles = await db
    .select()
    .from(articles)
    .where(isNull(articles.collectionId))
    .orderBy(desc(articles.publishedAt));

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="mt-2" style={{ color: "var(--ink-soft)" }}>
          Articles and collections.
        </p>
      </header>

      {allCollections.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">Collections</h2>
          <ul className="space-y-3">
            {allCollections.map((c) => (
              <li key={c.id} className="border-b pb-3" style={{ borderColor: "var(--line)" }}>
                <Link href={`/collections/${c.slug}`} className="font-medium hover:underline">
                  {c.title}
                </Link>
                {c.passcodeHash && (
                  <span
                    className="ml-2 text-xs uppercase tracking-wide"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    locked
                  </span>
                )}
                {c.description && (
                  <p className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>
                    {c.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-4">Articles</h2>
        {standaloneArticles.length === 0 ? (
          <p style={{ color: "var(--ink-soft)" }}>No articles yet.</p>
        ) : (
          <ul className="space-y-3">
            {standaloneArticles.map((a) => (
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
      </section>
    </main>
  );
}
