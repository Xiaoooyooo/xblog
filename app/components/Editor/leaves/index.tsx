import { RenderLeafProps } from "slate-react";
import Title from "./Title";
import Blod from "./Blod";

export default function renderLeaf(props: RenderLeafProps) {
  console.log("renderLeaf", props);
  const { leaf } = props;
  switch (leaf.type) {
    case "blod":
      return <Blod {...props} />;
    case "title":
      return <Title {...props} />;
    default:
      return <span {...props.attributes}>{props.children}</span>;
  }
}
