import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
import { adminLogin, createCollection, uploadArticle } from "./actions";
import { ImageUploader } from "./ImageUploader";
import { DEFAULT_COLLECTION_SLUG } from "@/lib/defaultCollection";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    created?: string;
    published?: string;
  }>;
}) {
  const { error, created, published } = await searchParams;
  const store = await cookies();
  const isAdmin = verifyAdminToken(store.get(ADMIN_COOKIE_NAME)?.value);

  if (!isAdmin) {
    return (
      <main>
        <h1>Admin</h1>
        <form action={adminLogin}>
          <input
            type="password"
            name="password"
            placeholder="Admin password"
            autoFocus
          />
          <button type="submit">Sign in</button>
        </form>
        {error && <p>Wrong password.</p>}
      </main>
    );
  }

  const allCollections = await db.select().from(collections);

  return (
    <main>
      <h1>Admin</h1>

      {created === "collection" && <p>Collection created.</p>}
      {published && <p>Published &ldquo;{published}&rdquo;.</p>}
      {error === "missing-fields" && <p>Title and slug are required.</p>}
      {error === "empty" && <p>Upload a file or paste some markdown first.</p>}

      <section>
        <h2>New collection</h2>
        <form action={createCollection}>
          <input name="title" placeholder="Title" />
          <input name="slug" placeholder="slug (e.g. travel-2026)" />
          <input name="description" placeholder="Description (optional)" />
          <input
            name="passcode"
            placeholder="Passcode (leave blank for a public collection)"
          />
          <button type="submit">Create collection</button>
        </form>
      </section>

      <section>
        <h2>Upload article</h2>
        <p>
          Upload a .md file, or paste markdown below. Include frontmatter for
          title/slug/excerpt:
        </p>
        <pre>{`---
title: My Post
slug: my-post
excerpt: A short teaser
---
Article body here...`}</pre>

        <div>
          <ImageUploader />
          <p>
            For video, paste a Vimeo embed &lt;iframe&gt; directly into your
            markdown — it&apos;s allowed through the sanitizer.
          </p>
        </div>

        <form action={uploadArticle}>
          <select name="collectionId" defaultValue="">
            <option
              key={DEFAULT_COLLECTION_SLUG}
              value={DEFAULT_COLLECTION_SLUG}
            >
              Default collection (public, standalone)
            </option>
            {allCollections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
                {c.passcodeHash ? " (locked)" : ""}
              </option>
            ))}
          </select>
          <input type="file" name="file" accept=".md,text/markdown" />
          <textarea
            name="markdown"
            rows={8}
            placeholder="...or paste markdown here instead of uploading a file"
          />
          <button type="submit">Publish</button>
        </form>
      </section>
    </main>
  );
}
