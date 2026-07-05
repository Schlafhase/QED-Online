import { db } from "@/lib/db/client";
import { articles, collections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyUnlockToken, unlockCookieName } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [article] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  if (!article) notFound();

  if (article.collectionId) {
    const [collection] = await db
      .select()
      .from(collections)
      .where(eq(collections.id, article.collectionId))
      .limit(1);

    if (collection?.passcodeHash) {
      const store = await cookies();
      const unlocked = verifyUnlockToken(
        collection.slug,
        store.get(unlockCookieName(collection.slug))?.value
      );
      if (!unlocked) redirect(`/collections/${collection.slug}?redirect-article=${slug}`);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{article.title}</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
            {new Date(article.publishedAt).toLocaleDateString()}
          </p>
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: article.renderedHtml }} />
      </article>
    </main>
  );
}
