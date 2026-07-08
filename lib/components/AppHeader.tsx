import { Title } from "@mantine/core";
import "./AppHeader.tsx.css";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function AppHeader() {
  return (
    <div className="header">
      <Title>QED Online</Title>
      <ThemeSwitcher />
    </div>
  );
}
