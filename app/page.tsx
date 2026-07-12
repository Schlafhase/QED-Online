import Link from "next/link";
import { db } from "@/lib/db/client";
import { articles, collections } from "@/lib/db/schema";
import { desc, eq, ne } from "drizzle-orm";
import { DEFAULT_COLLECTION_SLUG } from "@/lib/defaultCollection";
import { Image, Space, Title } from "@mantine/core";
import About from "@/lib/components/About";
import Values from "@/lib/components/Values";
import TesterInformation from "@/lib/components/TesterInformation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allCollections = await db
    .select()
    .from(collections)
    .where(ne(collections.id, DEFAULT_COLLECTION_SLUG))
    .orderBy(desc(collections.createdAt));

  const standaloneArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.collectionId, DEFAULT_COLLECTION_SLUG))
    .orderBy(desc(articles.publishedAt));

  return (
    <main>
      <section>
        <Image w={"100%"} h={300} mb={"md"}></Image>
        <div style={{ textAlign: "justify" }}>
          {process.env.INSTANCE === "test" && <TesterInformation />}
          <About />
          <Values />
        </div>
      </section>
      <Space h={200} />
      {allCollections.length > 0 && (
        <section>
          <Title>Ausgaben</Title>
          <ul>
            {allCollections.map((c) => (
              <li key={c.id}>
                <Link href={`/collections/${c.slug}`}>{c.title}</Link>
                {/* {c.passcodeHash && <LockIcon></LockIcon>} */}
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
