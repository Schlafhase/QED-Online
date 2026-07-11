import { db } from "@/lib/db/client";
import { articles, collections } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyUnlockToken, unlockCookieName } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { Container, Title, Typography } from "@mantine/core";
import "./article.css";

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
      collection.id,
      store.get(unlockCookieName(collection.id))?.value,
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
      <Container maw={"max(700px, 40vw)"}>
        <article>
          <header>
            <Title order={1} size={50}>
              {article.title}
            </Title>
            {article.showDate && (
              <p
                className="minor"
                style={{ fontFamily: "var(--font-noto-sans)" }}
              >
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            )}
          </header>
          <div
            className="articleContent"
            dangerouslySetInnerHTML={{ __html: article.renderedHtml }}
          />
        </article>
      </Container>
    </main>
  );
}
