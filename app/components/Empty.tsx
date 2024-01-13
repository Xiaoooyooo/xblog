import { ReactNode } from "react";
type EmptyProps = {
  image?: ReactNode;
  tips?: string;
};

export default function Empty(props: EmptyProps) {
  const { image, tips = "没有数据" } = props;
  return (
    <div className="p-10 text-center">
      {image}
      <p>{tips}</p>
    </div>
  );
}
