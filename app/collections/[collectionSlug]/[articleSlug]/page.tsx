import { db } from "@/lib/db/client";
import { articles, collections } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyUnlockToken, unlockCookieName } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ collectionSlug: string; articleSlug: string }>;
}) {
  const { collectionSlug, articleSlug } = await params;

  const [collection] = await db
    .select()
    .from(collections)
    .where(eq(collections.slug, collectionSlug))
    .limit(1);

  if (!collection) notFound();

  if (collection.passcodeHash) {
    const store = await cookies();
    const unlocked = verifyUnlockToken(
      collection.slug,
      store.get(unlockCookieName(collection.slug))?.value,
    );
    if (!unlocked)
      redirect(
        `/collections/${collection.slug}?redirectArticle=${articleSlug}`,
      );
  }

  const [article] = await db
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.collectionId, collection.id),
        eq(articles.slug, articleSlug),
      ),
    )
    .limit(1);
  if (!article) notFound();

  return (
    <main>
      <article>
        <header>
          <h1>{article.title}</h1>
          <p>{new Date(article.publishedAt).toLocaleDateString()}</p>
        </header>
        <div dangerouslySetInnerHTML={{ __html: article.renderedHtml }} />
      </article>
    </main>
  );
}
