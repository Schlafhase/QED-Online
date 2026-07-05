import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
import { adminLogin, createCollection, uploadArticle } from "./actions";
import { ImageUploader } from "./ImageUploader";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; created?: string; published?: string }>;
}) {
  const { error, created, published } = await searchParams;
  const store = await cookies();
  const isAdmin = verifyAdminToken(store.get(ADMIN_COOKIE_NAME)?.value);

  if (!isAdmin) {
    return (
      <main className="mx-auto w-full max-w-sm px-6 py-24">
        <h1 className="text-2xl font-bold mb-6">Admin</h1>
        <form action={adminLogin} className="flex gap-2">
          <input
            type="password"
            name="password"
            placeholder="Admin password"
            autoFocus
            className="flex-1 rounded border px-3 py-2"
            style={{ borderColor: "var(--line)" }}
          />
          <button
            type="submit"
            className="rounded px-4 py-2 text-white"
            style={{ background: "var(--accent)" }}
          >
            Sign in
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">Wrong password.</p>}
      </main>
    );
  }

  const allCollections = await db.select().from(collections);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16 space-y-16">
      <h1 className="text-3xl font-bold">Admin</h1>

      {created === "collection" && (
        <p className="rounded bg-green-50 text-green-800 px-3 py-2 text-sm">
          Collection created.
        </p>
      )}
      {published && (
        <p className="rounded bg-green-50 text-green-800 px-3 py-2 text-sm">
          Published &ldquo;{published}&rdquo;.
        </p>
      )}
      {error === "missing-fields" && (
        <p className="rounded bg-red-50 text-red-800 px-3 py-2 text-sm">
          Title and slug are required.
        </p>
      )}
      {error === "empty" && (
        <p className="rounded bg-red-50 text-red-800 px-3 py-2 text-sm">
          Upload a file or paste some markdown first.
        </p>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-4">New collection</h2>
        <form action={createCollection} className="space-y-3">
          <input
            name="title"
            placeholder="Title"
            className="w-full rounded border px-3 py-2"
            style={{ borderColor: "var(--line)" }}
          />
          <input
            name="slug"
            placeholder="slug (e.g. travel-2026)"
            className="w-full rounded border px-3 py-2"
            style={{ borderColor: "var(--line)" }}
          />
          <input
            name="description"
            placeholder="Description (optional)"
            className="w-full rounded border px-3 py-2"
            style={{ borderColor: "var(--line)" }}
          />
          <input
            name="passcode"
            placeholder="Passcode (leave blank for a public collection)"
            className="w-full rounded border px-3 py-2"
            style={{ borderColor: "var(--line)" }}
          />
          <button
            type="submit"
            className="rounded px-4 py-2 text-white"
            style={{ background: "var(--accent)" }}
          >
            Create collection
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Upload article</h2>
        <p className="text-sm mb-4" style={{ color: "var(--ink-soft)" }}>
          Upload a .md file, or paste markdown below. Include frontmatter for
          title/slug/excerpt:
        </p>
        <pre
          className="text-xs p-3 rounded mb-4 overflow-x-auto"
          style={{ background: "#f0eee7" }}
        >{`---
title: My Post
slug: my-post
excerpt: A short teaser
---
Article body here...`}</pre>

        <div className="mb-4">
          <ImageUploader />
          <p className="text-xs mt-2" style={{ color: "var(--ink-soft)" }}>
            For video, paste a Vimeo embed &lt;iframe&gt; directly into your
            markdown — it&apos;s allowed through the sanitizer.
          </p>
        </div>

        <form action={uploadArticle} className="space-y-3" encType="multipart/form-data">
          <select
            name="collectionId"
            className="w-full rounded border px-3 py-2"
            style={{ borderColor: "var(--line)" }}
            defaultValue=""
          >
            <option value="">No collection (public, standalone)</option>
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
            className="w-full rounded border px-3 py-2 font-mono text-sm"
            style={{ borderColor: "var(--line)" }}
          />
          <button
            type="submit"
            className="rounded px-4 py-2 text-white"
            style={{ background: "var(--accent)" }}
          >
            Publish
          </button>
        </form>
      </section>
    </main>
  );
}
