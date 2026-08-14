"use client";

import type { DefaultNodeTypes } from "@payloadcms/richtext-lexical";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import {
  type JSXConvertersFunction,
  RichText,
} from "@payloadcms/richtext-lexical/react";
import React, { JSX } from "react";

type NodeTypes = DefaultNodeTypes;

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,

  // Paragraphs
  paragraph: ({ nodesToJSX, ...props }) => {
    const children = nodesToJSX({ nodes: props.node.children, ...props });
    return (
      <p className="mb-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
        {children}
      </p>
    );
  },

  // Headings
  heading: ({ nodesToJSX, ...props }) => {
    const children = nodesToJSX({ nodes: props.node.children, ...props });
    const Tag = `${props.node.tag}` as keyof JSX.IntrinsicElements;
    const headingStyles = {
      h1: "text-3xl md:text-4xl font-bold mb-8 mt-8 text-gray-900 dark:text-gray-100",
      h2: "text-2xl md:text-3xl font-bold mb-8 mt-7 text-gray-900 dark:text-gray-100",
      h3: "text-xl md:text-2xl font-semibold mb-6 mt-6 text-gray-900 dark:text-gray-100",
      h4: "text-lg md:text-xl font-semibold mb-4 mt-5 text-gray-800 dark:text-gray-200",
      h5: "text-md md:text-lg font-semibold mb-3 mt-4 text-gray-800 dark:text-gray-200",
      h6: "text-base font-semibold mb-2 mt-3 text-gray-800 dark:text-gray-200",
    };

    return (
      <Tag
        className={headingStyles[props.node.tag as keyof typeof headingStyles]}
      >
        {children}
      </Tag>
    );
  },

  // Lists
  list: ({ nodesToJSX, ...props }) => {
    const children = nodesToJSX({ nodes: props.node.children, ...props });
    const ListTag = props.node.listType === "bullet" ? "ul" : "ol";
    const listStyles =
      props.node.listType === "bullet"
        ? "list-disc list-inside mb-4 space-y-2"
        : "list-decimal list-inside mb-4 space-y-2";

    return <ListTag className={listStyles}>{children}</ListTag>;
  },

  listitem: ({ nodesToJSX, ...props }) => {
    const children = nodesToJSX({ nodes: props.node.children, ...props });
    return (
      <li className="text-base text-gray-700 dark:text-gray-300 ml-4">
        {children}
      </li>
    );
  },

  // Links
  link: ({ nodesToJSX, ...props }) => {
    const children = nodesToJSX({ nodes: props.node.children, ...props });
    return (
      <a
        href={props.node.fields.url}
        target={props.node.fields.newTab ? "_blank" : undefined}
        rel={props.node.fields.newTab ? "noopener noreferrer" : undefined}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
      >
        {children}
      </a>
    );
  },

  // Quotes
  quote: ({ nodesToJSX, ...props }) => {
    const children = nodesToJSX({ nodes: props.node.children, ...props });
    return (
      <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 mb-4 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
        {children}
      </blockquote>
    );
  },

  // Code blocks
  code: ({ nodesToJSX, ...props }) => {
    const children = nodesToJSX({ nodes: props.node.children, ...props });
    return (
      <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto border border-gray-700">
        <code className="text-sm font-mono">{children}</code>
      </pre>
    );
  },

  // Text formatting
  text: (props) => {
    let text = <span>{props.node.text}</span>;

    if (props.node.format & 1) {
      // Bold
      text = <strong className="font-bold">{text}</strong>;
    }
    if (props.node.format & 2) {
      // Italic
      text = <em className="italic">{text}</em>;
    }
    if (props.node.format & 8) {
      // Underline
      text = <u className="underline">{text}</u>;
    }
    if (props.node.format & 4) {
      // Strikethrough
      text = <s className="line-through">{text}</s>;
    }
    if (props.node.format & 16) {
      // Code
      text = (
        <code className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-200 dark:border-gray-700">
          {text}
        </code>
      );
    }

    return text;
  },

  // Horizontal rule
  horizontalrule: () => (
    <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" />
  ),
});

export const LexicalConverter: React.FC<{
  data: SerializedEditorState;
}> = ({ data }) => {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none my-10 md:my-0">
      <RichText converters={jsxConverters} data={data} />
    </div>
  );
};