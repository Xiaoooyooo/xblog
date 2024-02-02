import { tags } from "@lezer/highlight";
import { HighlightStyle } from "@codemirror/language";

const highlightTheme = HighlightStyle.define([
  { tag: tags.heading1, fontWeight: "bold", fontSize: "1.6em" },
  { tag: tags.heading2, fontWeight: "bold", fontSize: "1.5em" },
  { tag: tags.heading3, fontWeight: "bold", fontSize: "1.4em" },
  { tag: tags.heading4, fontWeight: "bold", fontSize: "1.3em" },
  { tag: tags.heading5, fontWeight: "bold", fontSize: "1.2em" },
  { tag: tags.heading6, fontWeight: "bold", fontSize: "1.1em" },
  { tag: tags.strong, fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.quote, color: "#5c6370" },
  {
    tag: tags.monospace,
    color: "#5c6370",
    backgroundColor: "#e1e1e1",
    borderRadius: "2px",
  },
  { tag: tags.deleted, color: "#5c6370" },
  { tag: tags.strikethrough, color: "#5c6370" },

  // code
  { tag: tags.comment, color: "#5c6370" },
  { tag: tags.keyword, color: "#c678dd" },
  { tag: tags.null, color: "#c678dd" },
  { tag: tags.name, color: "#e06c75" },
  { tag: tags.literal, color: "#98c379" },
  { tag: tags.string, color: "#17aa00" },

  { tag: tags.regexp, color: "#98c379" },
  { tag: tags.attributeValue, color: "#17aa00" },

  { tag: tags.link, color: "#61aeee" },
  { tag: tags.meta, color: "#61aeee" },

  { tag: tags.number, color: "#905" },
  { tag: tags.tagName, color: "#905" },
  { tag: tags.bool, color: "#905" },
  { tag: tags.character, color: "#690" },
  { tag: tags.inserted, color: "#690" },
  { tag: tags.operator, color: "#9a6e3a" },
  { tag: tags.url, color: "#9a6e3a" },
  { tag: tags.className, color: "#DD4A68" },
  { tag: tags.attributeName, color: "#be6400" },
  { tag: tags.variableName, color: "#be6400" },
]);

export default highlightTheme;
