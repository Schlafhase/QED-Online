"use client";

import { useState } from "react";
import { sanitiseSlugInput, SLUG_REGEX, slugify } from "../slug";
import { TextInput } from "@mantine/core";

export function SlugInput({
  name,
  placeholder,
  defaultValue = "",
}: {
  name: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <TextInput
      name={name}
      label="Slug"
      value={value}
      onChange={(e) => setValue(sanitiseSlugInput(e.target.value))}
      onBlur={() => setValue((v) => slugify(v))}
      placeholder={placeholder}
      pattern={SLUG_REGEX.source}
      description="Nur Kleinbuchstaben, Zahlen und Bindestriche"
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      withAsterisk
    />
  );
}
