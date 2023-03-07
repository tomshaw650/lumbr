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

  const handleMarkdownChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMarkdown(event.target.value);
    onChange(event);
    fieldOnChange(event);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex w-1/2 flex-col p-4">
        <textarea
          name={name}
          className="flex-1 resize-none rounded-lg border border-gray-300 bg-white p-2 focus:outline-none"
          placeholder="Start typing in Markdown..."
          value={markdown}
          onChange={handleMarkdownChange}
        />
      </div>
      <div className="w-1/2 overflow-y-scroll whitespace-normal bg-white">
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
    </div>
  );
};

export default MarkdownEditor;
