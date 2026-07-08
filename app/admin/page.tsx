import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
import { adminLogin, createCollection, uploadArticle } from "./actions";
import { ImageUploader } from "./ImageUploader";
import { DEFAULT_COLLECTION_SLUG } from "@/lib/defaultCollection";
import { ne } from "drizzle-orm";
import { SlugInput } from "@/lib/components/SlugInput";
import { MDXEditor } from "@mdxeditor/editor";
import { MDEditor } from "@/lib/components/MDEditor";

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
            placeholder="Admin Passwort"
            autoFocus
          />
          <button type="submit">Anmelden</button>
        </form>
        {error && <p>Falsches Passwort</p>}
      </main>
    );
  }

  const allCollections = await db
    .select()
    .from(collections)
    .where(ne(collections.slug, DEFAULT_COLLECTION_SLUG));

  return (
    <main>
      <h1>Admin</h1>

      {created === "collection" && <p>Sammlung erstellt.</p>}
      {published && <p>&ldquo;{published}&rdquo; veröffentlicht.</p>}
      {error === "missing-fields" && (
        <p>Titel und Slug müssen ausgefüllt werden.</p>
      )}
      {error === "empty" && (
        <p>Es wurde kein Inhalt für den Artikel angegeben.</p>
      )}

      <section>
        <h2>Neue Sammlung</h2>
        <form action={createCollection}>
          <input name="title" placeholder="Titel" />
          <SlugInput name="slug" placeholder="Slug" />
          <input name="description" placeholder="Beschreibung (optional)" />
          <input
            name="passcode"
            placeholder="Code (freilassen für eine öffentliche Sammlung)"
          />
          <button type="submit">Sammlung erstellen</button>
        </form>
      </section>

      <section>
        <h2>Artikel hochladen</h2>
        <p>
          Artikel werden in Markdown geschrieben. Du kannst eine Datei hochladen
          oder direkt in das Textfeld schreiben. Um Titel/slug/Auszug
          festzulegen, wird ein frontmatter verwendet:
        </p>
        <pre>{`---
title: Mein Artikel
slug: mein-artikel
excerpt: Sehr spannender Text...
---
Hier geht der Artikel los...`}</pre>

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
          <MDEditor markdown="hi" />
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
