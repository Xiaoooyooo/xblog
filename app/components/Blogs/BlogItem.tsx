import { MouseEvent } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import moment from "@/utils/moment";
import CalendarIcon from "@/assets/icons/calendar.svg";
import TagIcon from "@/assets/icons/tag.svg";
import CategoryIcon from "@/assets/icons/category.svg";
import { Blog } from "@/types";

type BlogItemProps = {
  blog: Blog;
  onMouseEnter?: (e: HTMLDivElement) => void;
  onMouseLeave?: (e: HTMLDivElement) => void;
};

function BlogItem(props: BlogItemProps) {
  const {
    blog: { id, title, content, categories, createdAt },
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
        <Link to={{ pathname: `/blog/${id}` }}>
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
            {content}
          </p>
        </Link>
        <div className={classNames("flex", "gap-4")}>
          <span className={classNames("flex", "items-center")}>
            <CalendarIcon />
            <span className={classNames("ml-1", "text-sm")}>
              {moment(createdAt).calendar()}
            </span>
          </span>
          {categories.length > 0 && (
            <span className="flex items-center">
              <CategoryIcon />
              {categories.map((category) => (
                <span
                  key={category.id}
                  className="ml-1 text-sm cursor-pointer hover:text-sky-600 transition-colors duration-200"
                >
                  {category.name}
                </span>
              ))}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}

export default BlogItem;
