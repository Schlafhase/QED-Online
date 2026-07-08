"use client";

import { useState } from "react";
import { sanitiseSlugInput, SLUG_REGEX, slugify } from "../slug";

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
    <input
      name={name}
      value={value}
      onChange={(e) => setValue(sanitiseSlugInput(e.target.value))}
      onBlur={() => setValue((v) => slugify(v))}
      placeholder={placeholder}
      pattern={SLUG_REGEX.source}
      title="Nur Kleinbuchstaben, Zahlen und Bindestriche"
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
    />
  );
}
