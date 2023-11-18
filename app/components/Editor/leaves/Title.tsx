import { RenderLeafProps } from "slate-react";
export default function Title(props: RenderLeafProps) {
  const { leaf, attributes, children } = props;
  switch (leaf.level) {
    case 1:
      return (
        <span {...attributes} className="text-3xl">
          {children}
        </span>
      );
    case 2:
      return (
        <span {...attributes} className="text-2xl">
          {children}
        </span>
      );
    case 3:
      return (
        <span {...attributes} className="text-xl">
          {children}
        </span>
      );
    case 4:
      return (
        <span {...attributes} className="text-lg">
          {children}
        </span>
      );
    case 5:
      return (
        <span {...attributes} className="text-base">
          {children}
        </span>
      );
    case 6:
      return (
        <span {...attributes} className="text-sm">
          {children}
        </span>
      );
    default:
      return children;
  }
}
