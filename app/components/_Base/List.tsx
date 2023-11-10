import React from "react";

type OrderListProps = React.ComponentProps<"ol">;
type UnorderListProps = React.ComponentProps<"ul">;
type ListItemProps = React.ComponentProps<"li">;
type ListProps = React.ComponentProps<"ol" | "ol"> & {
  order: boolean;
};

function OrderList(props: OrderListProps) {
  const { className, children, ...rest } = props;
  const classes = `${className}`;
  return (
    <ol className={classes} {...rest}>
      {children}
    </ol>
  );
}

function UnorderList(props: UnorderListProps) {
  const { className, children, ...rest } = props;
  const classes = `${className}`;
  return (
    <ul className={classes} {...rest}>
      {children}
    </ul>
  );
}

function ListItem(props: ListItemProps) {
  const { className, children, ...rest } = props;
  const classes = `${className}`;
  return (
    <li className={classes} {...rest}>
      {children}
    </li>
  );
}
function List(props: ListProps) {
  const { order = false, ...rest } = props;
  return order ? <OrderList {...rest} /> : <UnorderList {...rest} />;
}

export { ListItem };

export default List;
