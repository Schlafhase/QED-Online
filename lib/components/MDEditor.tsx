"use client";

import { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { forwardRef } from "react";
import "@mdxeditor/editor/style.css";
import "./MDEditor.tsx.css";

const Editor = dynamic(() => import("./InitializedMDXEditor"), {
  ssr: false,
});

export const MDEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => <Editor {...props} editorRef={ref} />,
);

MDEditor.displayName = "MDEditor";
