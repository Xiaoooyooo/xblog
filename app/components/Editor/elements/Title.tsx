import Paragraph from "./Paragraph";
import { RenderElementProps } from "slate-react";

export default function Title(props: RenderElementProps) {
  const { attributes, children, element } = props;
  switch (element.level) {
    case 1:
      return <h1 {...attributes}>{children}</h1>;
    case 2:
      return <h2 {...attributes}>{children}</h2>;
    case 3:
      return <h3 {...attributes}>{children}</h3>;
    case 4:
      return <h4 {...attributes}>{children}</h4>;
    case 5:
      return <h5 {...attributes}>{children}</h5>;
    case 6:
      return <h6 {...attributes}>{children}</h6>;
    default:
      return <Paragraph {...props} />;
  }
}
