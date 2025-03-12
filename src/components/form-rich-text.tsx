import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useState, useEffect } from "react";
import {
  LuBold,
  LuItalic,
  LuLink,
  LuList,
  LuListOrdered,
} from "react-icons/lu";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type FormRichTextProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  form: UseFormReturn<TFieldValues, any, undefined>;
  name: TName;
  label?: string;
  placeholder?: string;
  className?: string;
  itemClassName?: string;
};

// Componente principal que se integra con react-hook-form
const FormRichText = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  form,
  name,
  label = "",
  placeholder = "",
  className,
  itemClassName,
}: FormRichTextProps<TFieldValues, TName>) => {
  const [isMounted, setIsMounted] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  // Obtener el valor inicial del formulario
  useEffect(() => {
    const value = form.getValues(name) as string;
    if (value) {
      setEditorContent(value);
    }
    setIsMounted(true);
  }, [form, name]);

  // Configurar el editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        validate: (href) => /^https?:\/\//.test(href),
      }),
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditorContent(html);
      form.setValue(name, html as any, { shouldValidate: true });
    },
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        placeholder: placeholder,
      },
    },
  });

  // Actualizar el editor cuando cambie el valor del formulario externamente
  useEffect(() => {
    const subscription = form.watch((value, { name: fieldName }) => {
      if (fieldName === name && editor && value[name] !== editor.getHTML()) {
        editor.commands.setContent(value[name] || "");
      }
    });
    return () => subscription.unsubscribe();
  }, [editor, form, name]);

  if (!isMounted) {
    return null;
  }

  const setLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={itemClassName}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="rich-text-editor">
              <div className="flex gap-1 pb-2 mb-2 border-b">
                <Button
                  type="button"
                  variant={editor?.isActive("bold") ? "default" : "outline"}
                  size="icon"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  disabled={!editor}
                >
                  <LuBold className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant={editor?.isActive("italic") ? "default" : "outline"}
                  size="icon"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  disabled={!editor}
                >
                  <LuItalic className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant={editor?.isActive("link") ? "default" : "outline"}
                  size="icon"
                  onClick={setLink}
                  disabled={!editor}
                >
                  <LuLink className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant={
                    editor?.isActive("bulletList") ? "default" : "outline"
                  }
                  size="icon"
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  disabled={!editor}
                >
                  <LuList className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant={
                    editor?.isActive("orderedList") ? "default" : "outline"
                  }
                  size="icon"
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                  disabled={!editor}
                >
                  <LuListOrdered className="w-4 h-4" />
                </Button>
              </div>
              <EditorContent editor={editor} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormRichText;
