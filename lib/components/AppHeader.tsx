import { Anchor, Group, Title } from "@mantine/core";
import "./AppHeader.tsx.css";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function AppHeader() {
  return (
    <Group h={"100%"} px={20} align="center" justify="space-between">
      <Anchor underline="never" href="/">
        <Title style={{ color: "var(--mantine-color-text)" }}>QED</Title>
      </Anchor>
      <ThemeSwitcher />
    </Group>
  );
}
