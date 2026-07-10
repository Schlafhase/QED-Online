"use client";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { Mark } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { forwardRef, useImperativeHandle } from "react";

const QedFont = Mark.create({
  name: "qedFont",
  inclusive: false,

  parseHTML() {
    return [
      {
        tag: 'span[style*="font-family: var(--font-cmu)"]',
      },
    ];
  },

  renderHTML() {
    return ["span", { style: "font-family: var(--font-cmu)" }, 0];
  },
});

const QedTypography = Typography.extend({
  addProseMirrorPlugins() {
    const qedFont = this.editor.schema.marks.qedFont;

    return [
      ...(this.parent?.() ?? []),
      new Plugin({
        appendTransaction(transactions, _oldState, newState) {
          if (!transactions.some((transaction) => transaction.docChanged)) {
            return null;
          }

          const transaction = newState.tr;

          newState.doc.descendants((node, position) => {
            if (!node.isText || qedFont.isInSet(node.marks)) {
              return;
            }

            for (const match of node.text?.matchAll(/QED/g) ?? []) {
              const from = position + (match.index ?? 0);
              transaction.addMark(from, from + 3, qedFont.create());
            }
          });

          return transaction.steps.length > 0 ? transaction : null;
        },
      }),
    ];
  },
});

export type RTEditorHandle = {
  getHTML: () => string;
  getText: () => string;
};

type RTEdiorProps = {};

const _RTEditor = forwardRef<RTEditorHandle, RTEdiorProps>(function _RTEditor(
  {},
  ref,
) {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Placeholder.configure({
        placeholder: "Hier kannst du deinen Artikel schreiben.",
      }),
      Link,
      Superscript,
      SubScript,
      Highlight,
      QedFont,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      QedTypography.configure({
        openDoubleQuote: "„",
        closeDoubleQuote: "“",
        openSingleQuote: "‚",
        closeSingleQuote: "‘",
      }),
    ],
  });

  useImperativeHandle(ref, () => ({
    getHTML: () => editor?.getHTML() ?? "",
    getText: () => editor?.getText() ?? "",
  }));

  return (
    <div style={{ textAlign: "justify" }}>
      <RichTextEditor editor={editor} mih={300}>
        <RichTextEditor.Toolbar
          sticky
          stickyOffset="var(--app-shell-header-offset)"
        >
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </div>
  );
});

export default _RTEditor;
