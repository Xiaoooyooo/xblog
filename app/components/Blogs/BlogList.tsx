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
import ClockIcon from "@/assets/icons/clock.svg";
import PersonIcon from "@/assets/icons/person.svg";
import BoxIcon from "@/assets/icons/box.svg";
import Tooltip from "../Tooltip";

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
          className="mb-2 p-2 md:mb-4 md:p-4 flex rounded transition-all relative z-20"
        >
          <section>{/* TODO: 封面图片 */}</section>
          <section className="flex-auto flex flex-col min-w-0">
            <Link to={{ pathname: `/blog/${blog.id}` }}>
              <div
                className={classNames(
                  "flex items-center gap-x-4",
                  "mb-2 md:mb-4",
                )}
              >
                <h1 className="text-xl md:text-2xl font-bold whitespace-nowrap text-ellipsis overflow-hidden">
                  {blog.title}
                </h1>
                {user.isLogin && (
                  <MenuTrigger menu={<BlogMenu blog={blog} reload={reload} />}>
                    <TreeDotIcon height={24} width={24} />
                  </MenuTrigger>
                )}
              </div>
              <p
                className={classNames(
                  "my-2 md:my-4",
                  "text-lg",
                  "leading-5",
                  "break-all",
                  "text-ellipsis",
                  "overflow-hidden",
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
                {blog.user.avatar ? (
                  <span className="block h-5 w-5 rounded-full overflow-hidden">
                    <img src={`/assets/avatar/${blog.user.avatar}`} />
                  </span>
                ) : (
                  <PersonIcon height={20} width={20} />
                )}
                <Link
                  to={{ pathname: `/user/${blog.user.id}` }}
                  className="ml-1"
                >
                  {blog.user.username}
                </Link>
              </span>
              <span className="flex items-center">
                <ClockIcon />
                <span className="inline md:hidden ml-1">
                  {moment(blog.createdAt).calendar()}
                </span>
                <Tooltip
                  className="hidden md:block ml-1 text-sm"
                  tip={moment(blog.createdAt).format("LLLL")}
                  unmountTipOnHide
                >
                  <span>{moment(blog.createdAt).calendar()}</span>
                </Tooltip>
              </span>
              {blog.categories.length > 0 && (
                <span className="flex items-center">
                  <BoxIcon />
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
