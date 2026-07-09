"use client";
import { createCollection } from "@/app/admin/actions";
import { Fieldset, Stack, TextInput, Button } from "@mantine/core";
import { SlugInput } from "./SlugInput";
import { notifications } from "@mantine/notifications";
import { MissingFieldError, InvalidFieldError } from "../errors";
import { useState } from "react";

export default function CreateCollectionForm() {
  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    try {
      await createCollection(formData);
      setFormKey(formKey + 1);
      notifications.show({
        title: "Sammlung erstellt",
        message: `${formData.get("title")} wurde erstellt.`,
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
    <Fieldset legend="Neue Sammlung">
      <form key={formKey} onSubmit={handleSubmit}>
        <Stack gap={5}>
          <TextInput
            name="title"
            label="Titel"
            description="Titel der Sammlung"
            placeholder="z.B. Sammlung 1"
            withAsterisk
          />
          <SlugInput name="slug" placeholder="z.B. sammlung-1" />
          <TextInput
            name="description"
            label="Beschreibung"
            description="(optional)"
            placeholder="Beschreibung"
          />
          <TextInput
            name="passcode"
            label="Code"
            description="Ein Code, um die Sammlung freizuschalten (optional)"
            placeholder="Code"
          />
          <Button type="submit">Sammlung erstellen</Button>
        </Stack>
      </form>
    </Fieldset>
  );
}
