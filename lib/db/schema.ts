import { boolean } from "drizzle-orm/gel-core";
import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const editions = sqliteTable("editions", {
  id: text("id").primaryKey(),
  releaseDate: integer("release_date", { mode: "timestamp" }).notNull(),
  editionNo: integer("edition_no").notNull(),
});

export const collections = sqliteTable("collections", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  passcodeHash: text("passcode_hash"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  editionId: text("edition_id")
    .unique()
    .references(() => editions.id),
});

export const articles = sqliteTable(
  "articles",
  {
    id: text("id").primaryKey(),
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    renderedHtml: text("rendered_html").notNull(),
    plainText: text("plain_text").notNull(),
    publishedAt: integer("published_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    showDate: integer("show_date", { mode: "boolean" }),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("articles_collection_slug_unique").on(
      table.collectionId,
      table.slug,
    ),
  ],
);

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
