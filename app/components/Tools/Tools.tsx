import { useState, useEffect, useMemo } from "react";
import { useNavigate, useMatch, useParams } from "react-router-dom";
import classNames from "classnames";
import { Transition } from "../Transition";
import EditIcon from "@/assets/icons/edit.svg";
import CreateIcon from "@/assets/icons/add.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import LoadingIcon from "@/assets/icons/circle-loading.svg";
import DraftIcon from "@/assets/icons/draft.svg";
import ToolItem from "./ToolItem";
import { useDeleteBlog } from "@/services/blog";
import message from "../Message/message";

type ToolItem = {
  id: string;
  tip: string;
  element: JSX.Element | ((isPending: boolean) => JSX.Element);
  onClick: (
    isPending: boolean,
    setIsPending: (value: boolean) => void,
  ) => boolean;
  visible?: boolean | (() => boolean);
};

type ToolProps = {
  //
};

export default function Tools(props: ToolProps) {
  const [isShowTools, setIsShowTools] = useState(false);
  const navigate = useNavigate();
  const matchBlogDetailPage = useMatch("/blog/:blogId");
  // whether current pathname matches blog detail path
  const isBlogDetailPage = useMemo(() => {
    return matchBlogDetailPage && matchBlogDetailPage.params.blogId !== "new";
  }, [matchBlogDetailPage]);
  const params = useParams();

  const { isSuccess: isDeleteSuccess, fetchFn: deleteBlog } = useDeleteBlog();

  const items = useMemo(() => {
    return (
      [
        {
          id: "new",
          tip: "新建",
          element: <CreateIcon className="h-5 w-5 md:h-7 md:w-7" />,
          onClick: function () {
            navigate({ pathname: "/blog/new" });
          },
        },
        {
          id: "edit",
          tip: "编辑",
          element: <EditIcon className="h-5 w-5 md:h-7 md:w-7" />,
          onClick: function () {
            navigate({ pathname: `/blog/${params.blogId}/edit` });
          },
          visible: isBlogDetailPage,
        },
        {
          id: "delete",
          tip: "删除",
          element: (isPending) =>
            isPending ? (
              <LoadingIcon className="h-5 w-5 md:h-7 md:w-7" />
            ) : (
              <TrashIcon className="h-5 w-5 md:h-7 md:w-7" />
            ),
          onClick: function (isPending, setIsPending) {
            if (isPending) return;
            setIsPending(true);
            deleteBlog(params.blogId!)
              .then((res) => {
                if (res) {
                  setIsShowTools(false);
                } else {
                  message({ type: "error", message: "删除失败，请稍后再试" });
                }
              })
              .finally(() => {
                setIsPending(false);
              });
            return false;
          },
          visible: isBlogDetailPage,
        },
        {
          id: "draft",
          tip: "草稿",
          element: <DraftIcon className="h-5 w-5 md:h-7 md:w-7" />,
          onClick: function () {
            navigate({ pathname: "/draft" });
          },
        },
      ] as ToolItem[]
    ).filter((item) => {
      if (typeof item.visible === "undefined") {
        return true;
      }
      if (typeof item.visible === "function") {
        return item.visible();
      }
      return item.visible;
    });
  }, [navigate, params, isBlogDetailPage]);

  useEffect(() => {
    if (isDeleteSuccess) {
      navigate({ pathname: "/" }, { replace: true });
    }
  }, [isDeleteSuccess]);

  useEffect(() => {
    function onDocumentClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("#tools")) {
        setIsShowTools(false);
      }
    }
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  return (
    <div
      id="tools"
      className={classNames(
        "fixed z-50 right-[20px] bottom-[80px] md:right-[60px] md:bottom-[130px]",
      )}
    >
      <div>
        <ToolButton
          onClick={() => setIsShowTools(!isShowTools)}
          open={isShowTools}
        />
      </div>

      <div className="absolute bottom-full">
        {items.map(({ id, element, onClick, tip }) => (
          <Transition
            key={id}
            show={isShowTools}
            duration={200}
            beforeEnterClassName="opacity-0 scale-75"
            enterActiveClassName="transition-all duration-200 ease-[cubic-bezier(.8,.36,0,2.01)]"
            enterDoneClassName=""
            beforeLeaveClassName="opacity-100"
            leaveActiveClassName="transition-all duration-200 ease-[cubic-bezier(.8,.36,0,2.01)]"
            leaveDoneClassName="opacity-0 scale-75"
            unmountOnHide
          >
            <ToolItem
              tip={tip}
              element={element}
              onClick={(...args) => {
                const isClose = onClick?.(...args);
                if (typeof isClose === "undefined" || isClose) {
                  setIsShowTools(false);
                }
              }}
            />
          </Transition>
        ))}
      </div>
    </div>
  );
}

type ToolButtonProps = {
  onClick: () => void;
  open: boolean;
};

function ToolButton(props: ToolButtonProps) {
  const { onClick, open } = props;
  return (
    <button
      onClick={onClick}
      className={classNames(
        "bg-[--background-color]",
        "h-9 w-9 md:h-[50px] md:w-[50px]",
        "rounded-full shadow-lg leading-[50px] text-center cursor-pointer",
        "hover:shadow-xl transition-all duration-200",
        "relative",
      )}
    >
      <span
        className={classNames(
          "absolute top-1/2 left-[20%] h-[3px] w-3/5 md:h-1",
          "bg-[--text-color] rounded-sm transition-transform duration-200",
          "origin-center -translate-y-2 md:-translate-y-[10px]",
          open && "-rotate-[45deg] !translate-y-0",
        )}
      ></span>
      <span
        className={classNames(
          "absolute top-1/2 left-[20%] h-[3px] w-3/5 md:h-1",
          "block h-1 w-3/5 bg-[--text-color] rounded-sm transition-all duration-200",
          open && "translate-x-full opacity-0",
        )}
      ></span>
      <span
        className={classNames(
          "absolute top-1/2 left-[20%] h-[3px] w-3/5 md:h-1",
          "block h-1 w-3/5 bg-[--text-color] rounded-sm transition-transform duration-200",
          "origin-center translate-y-2 md:translate-y-[10px]",
          open && "rotate-[45deg] !translate-y-0",
        )}
      ></span>
    </button>
  );
}
