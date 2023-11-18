import { RenderElementProps } from "slate-react";
type CodeProps = RenderElementProps & {
  //
};

function Code(props: CodeProps) {
  const { children, attributes } = props;
  return (
    <div {...attributes} className="bg-slate-300">
      {children}
    </div>
  );
}

function CodeBlock(props: RenderElementProps) {
  const { children, attributes } = props;
  return <div {...attributes}>{children}</div>;
}

function CodeLine(props: RenderElementProps) {
  const { children, attributes } = props;
  return <div {...attributes}>{children}</div>;
}

function CodeSchema(props: RenderElementProps) {
  const { children, attributes } = props;
  return <div {...attributes}>{children}</div>;
}

export { Code, CodeSchema, CodeBlock, CodeLine };
