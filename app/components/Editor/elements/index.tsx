import { RenderElementProps } from "slate-react";
import Title from "./Title";
import Paragraph from "./Paragraph";
import { Code, CodeSchema, CodeBlock, CodeLine } from "./Code";

export default function renderElement(props: RenderElementProps) {
  const { element } = props;
  switch (element.type) {
    case "title":
      return <Title {...props} />;
    case "code":
      return <Code {...props} />;
    case "code-schema-header":
      return <CodeSchema {...props} />;
    case "code-block":
      return <CodeBlock {...props} />;
    case "code-line":
      return <CodeLine {...props} />;
    case "code-schema-footer":
      return <CodeSchema {...props} />;
    case "paragraph":
    default:
      return <Paragraph {...props} />;
  }
}
