"use client";

import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { MoonStarsIcon, SunIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ActionIcon size={32} variant="default" />;
  }

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };

  return (
    <ActionIcon size={32} variant="default" onClick={toggleColorScheme}>
      {computedColorScheme === "light" ? <MoonStarsIcon /> : <SunIcon />}
    </ActionIcon>
  );
}
