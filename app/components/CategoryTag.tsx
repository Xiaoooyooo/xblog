import { Link } from "react-router-dom";
import { Category } from "@/types";
import classNames from "classnames";

type CategoryTagProps = {
  category: Category;
  className?: string;
};

export default function CategoryTag(props: CategoryTagProps) {
  const { category, className } = props;

  return (
    <Link
      to={{ pathname: `/category/${category.id}` }}
      className={classNames("inline", className)}
    >
      {category.name}
    </Link>
  );
}
