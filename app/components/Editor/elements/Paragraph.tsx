import { RenderElementProps } from "slate-react";

type ParagraphProps = RenderElementProps & {
  //
};

export default function Paragraph(props: ParagraphProps) {
  const { children, attributes } = props;
  return <div {...attributes}>{children}</div>;
}
