import Link from "next/link";
import { db } from "@/lib/db/client";
import { articles, collections } from "@/lib/db/schema";
import { desc, eq, ne } from "drizzle-orm";
import { DEFAULT_COLLECTION_SLUG } from "@/lib/defaultCollection";
import { Center, Container, Title } from "@mantine/core";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allCollections = await db
    .select()
    .from(collections)
    .where(ne(collections.id, DEFAULT_COLLECTION_SLUG));
  const standaloneArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.collectionId, DEFAULT_COLLECTION_SLUG))
    .orderBy(desc(articles.publishedAt));

  return (
    <main>
      {allCollections.length > 0 && (
        <section>
          <Title>Ausgaben</Title>
          <ul>
            {allCollections.map((c) => (
              <li key={c.id}>
                <Link href={`/collections/${c.slug}`}>{c.title}</Link>
                {/* {c.passcodeHash && <span>locked</span>} */}
                {c.description && <p>{c.description}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {standaloneArticles.length > 0 ? (
        <section>
          <h2>Artikel</h2>
          <ul>
            {standaloneArticles.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/collections/${DEFAULT_COLLECTION_SLUG}/${a.slug}`}
                >
                  {a.title}
                </Link>
                {a.excerpt && <p>{a.excerpt}</p>}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <></>
      )}
    </main>
  );
}
