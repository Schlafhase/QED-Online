import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
import { adminLogin } from "./actions";
import { DEFAULT_COLLECTION_SLUG } from "@/lib/defaultCollection";
import { ne } from "drizzle-orm";
import { Center, Divider, SimpleGrid, Title } from "@mantine/core";
import UploadArticleForm from "@/lib/components/UploadArticleForm";
import CreateEditionForm from "@/lib/components/CreateEditionForm";
import CreateCollectionForm from "@/lib/components/CreateCollectionForm";

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
  const { error } = await searchParams;
  const store = await cookies();
  const isAdmin = verifyAdminToken(store.get(ADMIN_COOKIE_NAME)?.value);

  if (!isAdmin) {
    return (
      <main>
        <Title>Admin</Title>
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
      <Center>
        <Title>Admin</Title>
      </Center>

      <Divider my={10} />

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <section>
          <CreateEditionForm />
        </section>

        <section>
          <CreateCollectionForm />
        </section>
      </SimpleGrid>

      <Divider my={10} />

      <section>
        <UploadArticleForm allCollections={allCollections} />
      </section>
    </main>
  );
}
