declare module "*.module.scss" {
  const content: { [className: string]: string };
  export = content;
}
declare module "*.scss" {
  const content: string;
  export = content;
}

declare module "*.css" {
  const content: string;
  export = content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  const content: React.FC<React.JSX.IntrinsicElements["svg"]>;
  export default content;
}
