import React from "react";

type IconProps = React.ComponentProps<"svg">;

function IconWrapper(props: IconProps) {
  const { children, style } = props;
  return React.cloneElement(children as React.ReactElement, {
    style: {
      verticalAlign: "middle",
      marginRight: "3px",
      fontSize: "18px",
      ...style
    }
  });
}

export default IconWrapper;
