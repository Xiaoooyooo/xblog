import { Link } from "react-router-dom";
import classNames from "classnames";
import moment from "@/utils/moment";
import { Blog } from "@/types";
import { List, ListItem } from "../List";
import BlogListSkeleton from "../Skeleton/BlogListSkeleton";
import Empty from "../Empty";
import Button from "../Button";
import { MenuTrigger } from "../Menu";
import { useSelector } from "@/hooks/redux";
import BlogMenu from "./BlogMenu";
import CategoryTag from "../CategoryTag";
import RefreshIcon from "@/assets/icons/refresh.svg";
import TreeDotIcon from "@/assets/icons/three-dot.svg";
import CalendarIcon from "@/assets/icons/calendar.svg";
import PersonIcon from "@/assets/icons/person.svg";
import CategoryIcon from "@/assets/icons/category.svg";

type BaseBlogListProps = {
  isLoading: boolean;
  isError: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  isSuccess: boolean;
  blogs: Blog[] | null;
};

type BlogListProps =
  | {
      isLoading: true;
      isError: false;
      error: null;
      isSuccess: false;
      blogs: null;
    }
  | {
      isLoading: false;
      isError: true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: any;
      isSuccess: false;
      blogs: null;
    }
  | {
      isLoading: false;
      isError: false;
      error: null;
      isSuccess: true;
      blogs: Blog[];
    };

type ReloadHandler = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reload: () => any;
};

function BlogList(props: BaseBlogListProps & ReloadHandler) {
  const { isLoading, isSuccess, isError, error, blogs, reload } =
    props as BlogListProps & ReloadHandler;
  const user = useSelector((state) => state.user);

  if (isLoading || (!isSuccess && !isError)) {
    return <BlogListSkeleton />;
  }

  if (isError) {
    return (
      <div className="h-[500px] pt-[200px] text-center">
        <p className="text-slate-400">数据加载失败了，请稍后再试一下哦。</p>
        <Button
          onClick={reload}
          className="text-sky-500 flex items-center m-auto"
        >
          <RefreshIcon className="mr-1" />
          Reload
        </Button>
      </div>
    );
  }
  if (isSuccess && blogs.length === 0) {
    return <Empty />;
  }

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
              <div className="flex items-center gap-x-4 mb-4">
                <h1 className="text-2xl font-bold">{blog.title}</h1>
                {user.isLogin && (
                  <MenuTrigger menu={<BlogMenu blog={blog} reload={reload} />}>
                    <TreeDotIcon height={24} width={24} />
                  </MenuTrigger>
                )}
              </div>
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
                    <CategoryTag
                      key={category.id}
                      category={category}
                      className="ml-1 text-sm cursor-pointer hover:text-sky-600 transition-colors duration-200"
                    />
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
