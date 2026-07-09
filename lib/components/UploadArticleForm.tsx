"use client";
import { uploadArticle } from "@/app/admin/actions";
import {
  Title,
  Stack,
  Select,
  TextInput,
  Button,
  Checkbox,
  Space,
} from "@mantine/core";
import { DEFAULT_COLLECTION_SLUG } from "../defaultCollection";
import RTEditor from "./RTEditor";
import { SlugInput } from "./SlugInput";
import { Collection } from "../db/schema";
import { useRef, useState } from "react";
import { RTEditorHandle } from "./_RTEditor";
import { notifications } from "@mantine/notifications";
import { MissingFieldError, InvalidFieldError } from "../errors";

export default function UploadArticleForm({
  allCollections,
}: {
  allCollections: Collection[];
}) {
  const editorRef = useRef<RTEditorHandle>(null);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.set("html", editorRef.current?.getHTML() ?? "");
    formData.set("text", editorRef.current?.getText() ?? "");

    try {
      await uploadArticle(formData);
      setFormKey(formKey + 1);
      notifications.show({
        title: "Artikel veröffentlicht",
        message: `${formData.get("title")} wurde veröffentlicht.`,
      });
    } catch (error: any) {
      if (error.name === MissingFieldError.name) {
        notifications.show({
          title: "Es wurden nicht alle Felder ausgefüllt",
          message: "Alle Felder mit * müssen ausgefüllt werden.",
          color: "red",
        });
      } else if (error.name === InvalidFieldError.name) {
        notifications.show({
          title: "Einige Felder sind ungültig",
          message:
            "Das sollte eigentlich nie passieren. Überprüfe nochmal alle Felder.",
          color: "red",
        });
      } else {
        notifications.show({
          title: "Unbekannter Fehler",
          message: error.message,
          color: "red",
        });
      }
    }
  }

  const [formKey, setFormKey] = useState(0);

  return (
    <>
      <Title order={2}>Artikel hochladen</Title>
      <form key={formKey} onSubmit={handleSubmit} autoComplete="off">
        <Stack gap={5}>
          <Select
            label="Sammlung"
            name="collectionId"
            defaultValue={DEFAULT_COLLECTION_SLUG}
            allowDeselect={false}
            data={[
              {
                value: DEFAULT_COLLECTION_SLUG,
                label: "Keine Sammlung (Artikel auf der Startseite)",
              },
              ...allCollections.map((c) => {
                return {
                  value: c.id,
                  label:
                    c.title + (c.passcodeHash ? " (nicht öffentlich)" : ""),
                };
              }),
            ]}
            withAsterisk
          />
          <TextInput
            name="title"
            label="Titel"
            description="Titel des Artikels"
            placeholder="z.B. Artikel 1"
            withAsterisk
          />
          <SlugInput name="slug" placeholder="z.B. artikel-1" />

          <Space h={5} />
          <Checkbox
            label="Veröffentlichungsdatum auf der Artikelseite anzeigen"
            name="showDate"
            defaultChecked
          />
          <p>
            Beachte, dass der oben gesetzte Titel über dem Artikel erscheinen
            wird. Es ist also in den meisten Fällen nicht nötig, den Artikel mit
            einem Titel zu starten.
          </p>

          <RTEditor ref={editorRef} />
          <Button type="submit">Veröffentlichen</Button>
        </Stack>
      </form>
    </>
  );
}
