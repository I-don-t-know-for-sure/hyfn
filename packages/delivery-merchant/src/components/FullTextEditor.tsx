import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import React, { useEffect, useState } from "react";
import { createStyles } from "hyfn-client";

// const content =
//   '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';

interface FullTextEditorProps {
  value: string;
  setValue: any;
}

const FullTextEditor: React.FC<FullTextEditorProps> = ({ setValue, value }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onBlur: (e) => {
      console.log(
        "🚀 ~ file: FullTextEditor.tsx:36 ~ value",
        e.editor.getHTML()
      );
      console.log("🚀 ~ file: FullTextEditor.tsx:36 ~ value", value);

      setValue(e.editor.getHTML());
    },
  });
  // useEffect(() => {
  //   console.log("🚀 ~ file: FullTextEditor.tsx:36 ~ value", newContent);
  //   editor?.commands?.setContent(newContent);
  // }, [newContent]);

  useEffect(() => {
    if (editor?.isEmpty) {
      console.log("🚀 ~ file: useFullTextEditor.tsx:20 ~ value:", value);

      editor.commands.setContent(value);
    }
  }, [value]);
  const useStyles = createStyles((theme) => ({
    root: {
      ...(theme.colorScheme === "dark"
        ? { backgroundColor: theme.colors.dark[6], color: theme.colors.dark[0] }
        : {}),
      // backgroundColor:
      //   theme.colorScheme === "dark"
      //     ? theme.colors.dark[6]
      //     : theme.colors.blue[1],
    },
    content: {
      ...(theme.colorScheme === "dark"
        ? { backgroundColor: theme.colors.dark[6], color: theme.colors.dark[0] }
        : {}),
    },
    toolbar: {
      ...(theme.colorScheme === "dark"
        ? { backgroundColor: theme.colors.dark[6], color: theme.colors.dark[0] }
        : {}),
    },
    control: {
      ...(theme.colorScheme === "dark"
        ? { backgroundColor: theme.colors.dark[6], color: theme.colors.dark[0] }
        : {}),
    },
    controlsGroup: {
      ...(theme.colorScheme === "dark"
        ? { backgroundColor: theme.colors.dark[6], color: theme.colors.dark[0] }
        : {}),
    },
  }));
  const { classes } = useStyles();
  return (
    <RichTextEditor
      classNames={{
        root: classes.root,
        toolbar: classes.toolbar,
        control: classes.control,
        content: classes.content,
        controlsGroup: classes.controlsGroup,
      }}
      editor={editor}
    >
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
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
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
};
export default FullTextEditor;
