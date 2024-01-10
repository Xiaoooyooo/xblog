import { createRoot } from "react-dom/client";
import { Copy } from "./copy";

type ActionProps = {
  lan: string | null;
  text: string;
};

function Action(props: ActionProps) {
  const { lan, text } = props;
  return (
    <div className="bg-[--markdown-code-header-background-color] p-2 flex">
      <div className="mr-auto">{lan}</div>
      <Copy text={text} />
    </div>
  );
}

class CodeAction extends HTMLElement {
  render() {
    const root = createRoot(this);
    const lan = this.getAttribute("data-lan");
    const code = this.nextElementSibling;
    if (!code || !code.matches("code.hljs")) {
      return;
    }
    const text = code.textContent || "";
    root.render(<Action lan={lan} text={text} />);
  }
  connectedCallback() {
    this.render();
  }
}

customElements.define("code-action", CodeAction);
