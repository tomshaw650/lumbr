import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface MarkdownEditorProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  fieldOnChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const MarkdownEditor = ({
  name,
  value,
  onChange,
  fieldOnChange,
}: MarkdownEditorProps) => {
  const [markdown, setMarkdown] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleMarkdownChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMarkdown(event.target.value);
    onChange(event);
    fieldOnChange(event);
  };

  const handlePreviewToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPreview(!showPreview);
  };

  return (
    <div className="flex h-screen flex-wrap bg-gray-100">
      <div
        className={`w-full md:w-1/2 ${
          showPreview ? "hidden md:block" : "block"
        }`}
      >
        <textarea
          name={name}
          className="h-full w-full resize-none rounded-lg border border-gray-300 bg-white p-2 focus:outline-none"
          placeholder="Start typing in Markdown..."
          value={markdown}
          onChange={handleMarkdownChange}
        />
      </div>
      <div
        className={`w-full bg-white md:block md:w-1/2 md:flex-none ${
          showPreview ? "block" : "hidden md:block"
        }`}
      >
        <div className="prose-sm p-4 sm:prose md:prose-lg lg:prose-xl">
          <ReactMarkdown
            children={markdown}
            components={{
              code({ node, inline, className, children, style, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          />
        </div>
      </div>
      <div className="md:hidden">
        <button
          onClick={handlePreviewToggle}
          className="fixed bottom-4 right-4 rounded-md bg-gray-500 p-2 text-white"
        >
          {showPreview ? "Edit" : "Preview"}
        </button>
      </div>
    </div>
  );
};

export default MarkdownEditor;
