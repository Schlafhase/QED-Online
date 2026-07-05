import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const collections = sqliteTable("collections", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  passcodeHash: text("passcode_hash"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const articles = sqliteTable("articles", {
  id: text("id").primaryKey(),
  collectionId: text("collection_id").references(() => collections.id, {
    onDelete: "set null",
  }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  markdownBody: text("markdown_body").notNull(),
  renderedHtml: text("rendered_html").notNull(),
  publishedAt: integer("published_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const media = sqliteTable("media", {
  id: text("id").primaryKey(),
  articleId: text("article_id").references(() => articles.id, {
    onDelete: "cascade",
  }),
  kind: text("kind", { enum: ["image", "video-embed"] }).notNull(),
  // For images: the object key/URL in your storage (e.g. Cloudflare R2).
  // For video-embed: the Vimeo (or other) embed URL.
  url: text("url").notNull(),
  alt: text("alt"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Media = typeof media.$inferSelect;
