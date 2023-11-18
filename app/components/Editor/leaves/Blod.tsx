import { RenderLeafProps } from "slate-react";

export default function Blod(props: RenderLeafProps) {
  const { attributes, children } = props;
  return <strong {...attributes}>{children}</strong>;
}
