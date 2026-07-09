"use client";
import { createEdition } from "@/app/admin/actions";
import { Fieldset, Stack, TextInput, NumberInput, Button } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { SlugInput } from "./SlugInput";
import { InvalidFieldError, MissingFieldError } from "../errors";
import { notifications } from "@mantine/notifications";
import React, { useState } from "react";

export default function CreateEditionForm() {
  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    try {
      await createEdition(formData);
      setFormKey(formKey + 1);
      notifications.show({
        title: "Ausgabe erstellt",
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
    <Fieldset legend="Neue Ausgabe">
      <form key={formKey} onSubmit={handleSubmit}>
        <Stack gap={5}>
          <TextInput
            name="title"
            label="Titel"
            description="Titel der Ausgabe"
            placeholder="z.B. Ausgabe 1"
            withAsterisk
          />
          <SlugInput name="slug" placeholder="z.B. ausgabe-1" />
          <NumberInput
            name="editionNumber"
            label="Ausgabennummer"
            description="Fortlaufende Nummerierung der Ausgaben"
            placeholder="z.B. 1"
            allowDecimal={false}
            withAsterisk
          />
          <DatePickerInput
            label="Erscheinungsdatum"
            placeholder="Wähle ein Datum aus"
            name="release"
            withAsterisk
          />
          <TextInput
            name="passcode"
            label="Code"
            description="Ein Code, um die Ausgabe freizuschalten"
            placeholder="Code"
            withAsterisk
          />
          <Button type="submit">Ausgabe erstellen</Button>
        </Stack>
      </form>
    </Fieldset>
  );
}
