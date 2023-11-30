import { Link } from "react-router-dom";
import classNames from "classnames";
import moment from "@/utils/moment";
import CalendarIcon from "@/assets/icons/calendar.svg";
import PersonIcon from "@/assets/icons/person.svg";
import CategoryIcon from "@/assets/icons/category.svg";
import { Blog } from "@/types";
import { List, ListItem } from "../List";

interface BlogListProps {
  blogs: Blog[];
}

function BlogList(props: BlogListProps) {
  const { blogs } = props;

  return (
    <List>
      {blogs.map((blog) => (
        <ListItem
          key={blog.id}
          className={classNames(
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
            <Link to={{ pathname: `/blog/${blog.id}` }}>
              <h1 className={classNames("text-2xl", "font-bold", "mb-4")}>
                {blog.title}
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
                {blog.content}
              </p>
            </Link>
            <div className="flex gap-4">
              <span className="flex items-center">
                <PersonIcon height={20} width={20} />
                <span className="ml-1">{blog.user.username}</span>
              </span>
              <span className="flex items-center">
                <CalendarIcon />
                <span className="ml-1 text-sm">
                  {moment(blog.createdAt).calendar()}
                </span>
              </span>
              {blog.categories.length > 0 && (
                <span className="flex items-center">
                  <CategoryIcon />
                  {blog.categories.map((category) => (
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
        </ListItem>
      ))}
    </List>
  );
}

export default BlogList;
