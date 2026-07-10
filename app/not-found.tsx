"use client";
import { Button, Center, Stack, Title } from "@mantine/core";
import { redirect } from "next/navigation";

export default function Http404() {
  return (
    <Center h={"70cqh"}>
      <Stack justify="center">
        <Title>404 - Nicht gefunden</Title>
        <Center>Diese Seite existiert nicht.</Center>
        <Button w="" onClick={() => redirect("/")}>
          Zurück zur Startseite
        </Button>
      </Stack>
    </Center>
  );
}
