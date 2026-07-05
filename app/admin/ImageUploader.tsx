"use client";

import { useState } from "react";

export function ImageUploader() {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [snippet, setSnippet] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/media", { method: "POST", body: formData });
      if (!res.ok) throw new Error("upload failed");
      const data = await res.json();
      setSnippet(`![${file.name}](${data.url})`);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded border p-3 space-y-2" style={{ borderColor: "var(--line)" }}>
      <label className="block text-sm font-medium">Upload an image</label>
      <input type="file" accept="image/*" onChange={handleChange} />
      {status === "uploading" && (
        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
          Uploading…
        </p>
      )}
      {status === "error" && <p className="text-sm text-red-600">Upload failed.</p>}
      {status === "done" && (
        <div>
          <p className="text-sm mb-1" style={{ color: "var(--ink-soft)" }}>
            Paste this into your markdown:
          </p>
          <code className="block text-xs p-2 rounded" style={{ background: "#f0eee7" }}>
            {snippet}
          </code>
        </div>
      )}
    </div>
  );
}
