"use client";
import { Grid, GridCol, ActionIcon, PasswordInput } from "@mantine/core";
import { ArrowRightIcon } from "@phosphor-icons/react";

export default function PWInput({ error }: { error?: boolean }) {
  return (
    <Grid align="flex-start" gap={5}>
      <GridCol span={"auto"}>
        <PasswordInput
          type="password"
          name="code"
          placeholder="Code"
          error={error && "Falscher Code"}
          autoFocus
        />
      </GridCol>
      <GridCol span={"content"}>
        <ActionIcon size={"input-sm"} variant="default" type="submit">
          <ArrowRightIcon />
        </ActionIcon>
      </GridCol>
    </Grid>
  );
}
