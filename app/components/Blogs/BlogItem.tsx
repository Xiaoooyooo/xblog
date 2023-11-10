import { MouseEvent } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import moment from "@/utils/moment";
import CalendarIcon from "@/assets/icons/calendar.svg";
import TagIcon from "@/assets/icons/tag.svg";
import CategoryIcon from "@/assets/icons/category.svg";

type BlogItemProps = {
  blog: Blog;
  onMouseEnter?: (e: HTMLDivElement) => void;
  onMouseLeave?: (e: HTMLDivElement) => void;
};

function BlogItem(props: BlogItemProps) {
  const {
    blog: { title, text, url, category, tags, createdAt },
    onMouseEnter,
    onMouseLeave,
  } = props;
  const handleMouseEnter = function (e: MouseEvent) {
    if (!onMouseEnter) return;
    onMouseEnter((e.target as HTMLDivElement).closest(".blog-item")!);
  };
  const handleMouseLeave = function (e: MouseEvent) {
    if (!onMouseLeave) return;
    onMouseLeave((e.target as HTMLDivElement).closest(".blog-item")!);
  };
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={classNames(
        "blog-item",
        "flex",
        "mb-4",
        "p-4",
        "rounded",
        "transition-all",
        "relative",
        "z-20",
      )}
    >
      <section>{/* TODO: 封面图片 */}</section>
      <section
        className={classNames("flex-auto", "flex", "flex-col", "min-w-0")}
      >
        <Link to={url}>
          <h1 className={classNames("text-2xl", "font-bold", "mb-4")}>
            {title}
          </h1>
          <p
            className={classNames(
              "text-lg",
              "leading-5",
              "break-all",
              "text-ellipsis",
              "overflow-hidden",
              "my-4",
              "[display:-webkit-box]",
              "[-webkit-line-clamp:2]",
              "[-webkit-box-orient:vertical]",
            )}
          >
            {text}
          </p>
        </Link>
        <div className={classNames("flex", "gap-4")}>
          <span className={classNames("flex", "items-center")}>
            <CalendarIcon />
            <span className={classNames("ml-1", "text-sm")}>
              {moment(createdAt).calendar()}
            </span>
          </span>
          <span className={classNames("flex", "items-center")}>
            <CategoryIcon />
            <span className="ml-1 text-sm">{category}</span>
          </span>
          <span className={classNames("flex", "items-center")}>
            <TagIcon />
            {tags.map((el) => (
              <span className="ml-1 text-sm" key={el}>
                {el}
              </span>
            ))}
          </span>
        </div>
      </section>
    </div>
  );
}

export default BlogItem;