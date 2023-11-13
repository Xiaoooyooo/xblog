import { Key, ReactElement } from "react";

type TransitionListProps = {
  children: ReactElement[];
};

type TransitionListItemProps = {
  children: ReactElement;
};

// todo
export default function TransitionList(props: TransitionListProps) {
  const { children } = props;

  return children.map((child) => (
    <TransitionListItem key={child.key as Key}>{child}</TransitionListItem>
  ));
}

function TransitionListItem(props: TransitionListItemProps) {
  const { children } = props;
  return children;
}
