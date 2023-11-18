// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

export type CustomEditor = BaseEditor & ReactEditor;

// export type FormattedText<T = undefined> = { type?: T; text: string };

// export type CustomElement<T> = {
//   type: T;
//   children: FormattedText[];
// };

// // Elements
// export type TitleElement = CustomElement<"title"> & {
//   level: number;
// };
// export type ParagraphElement = CustomElement<"paragraph">;

// export type CodeElement = CustomElement<"code">;

// export type CodeSchemaElement = CustomElement<
//   "code-schema-header" | "code-schema-footer"
// >;
// export type CodeContentElement = CustomElement<"code-content">;

// export type CodeLineElement = CustomElement<"code-line">;

// export type EditorElement =
//   | TitleElement
//   | ParagraphElement
//   | CodeElement
//   | CodeSchemaElement
//   | CodeContentElement
//   | CodeLineElement;

// // Leaves
// export type BlodText = FormattedText<"blod">;

// export type EditorText = BlodText;

type Elements =
  | "title"
  | "paragraph"
  | "code"
  | "code-schema-header"
  | "code-schema-footer"
  | "code-block"
  | "code-line";

type Leaves = "title" | "blod" | "italic";

declare module "slate" {
  interface BaseElement {
    type: Elements;
    /** only for title element */
    level?: number;
  }
  interface BaseText {
    type?: Leaves;
    /** only for title */
    level?: number;
  }
  interface BaseRange {
    type: Elements | Leaves | string;
    level?: number;
  }
  interface CustomTypes {
    Editor: CustomEditor;
  }
}
