import { useState, useEffect, memo } from "react";
import { useNavigate, useMatch, useParams } from "react-router-dom";
import classNames from "classnames";
import { Transition } from "../Transition";
import EditIcon from "@/assets/icons/edit.svg";
import CreateIcon from "@/assets/icons/add.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import LoadingIcon from "@/assets/icons/circle-loading.svg";
import { deleteBlog } from "@/services/functions/blog";

type ToolItem = {
  id: string;
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
  const matchBlogDetailPage = useMatch("/blog/:id");
  const params = useParams();

  const items = (
    [
      {
        id: "new",
        element: <CreateIcon className="h-7 w-7" />,
        onClick: function () {
          navigate({ pathname: "/new" });
        },
      },
      {
        id: "edit",
        element: <EditIcon className="h-7 w-7" />,
        onClick: function () {
          __DEV__ && console.log("edit", params);
          navigate({ pathname: `/edit/${params.blogId}` });
        },
        visible: () => !!matchBlogDetailPage,
      },
      {
        id: "delete",
        element: (isPending) =>
          isPending ? (
            <LoadingIcon height={22} width={22} />
          ) : (
            <TrashIcon className="h-7 w-7" />
          ),
        onClick: function (isPending, setIsPending) {
          __DEV__ && console.log("delete", params);
          if (isPending) return;
          setIsPending(true);
          deleteBlog(params.blogId!)
            .then((res) => {
              if (res) {
                setIsShowTools(false);
                setTimeout(() => {
                  navigate({ pathname: "/" });
                }, 100);
              } else {
                __DEV__ && console.log("delete failed", res);
              }
            })
            .finally(() => {
              setIsPending(false);
            });
          return false;
        },
        visible: () => !!matchBlogDetailPage,
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
    <div id="tools" className="fixed right-[60px] bottom-[60px]">
      <div>
        <ToolButton
          onClick={() => setIsShowTools(!isShowTools)}
          open={isShowTools}
        />
      </div>

      <div className="absolute bottom-full">
        {items.map(({ id, element, onClick }) => (
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
              element={element}
              onClick={(...args) => {
                const isClose = onClick?.(...args);
                if (typeof isClose !== "undefined" && isClose !== false) {
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
        "rounded-full shadow-lg h-[50px] w-[50px] leading-[50px] text-center cursor-pointer",
        "hover:shadow-xl transition-all duration-200",
        "flex items-center justify-center flex-col gap-y-[6px]",
      )}
    >
      <span
        className={classNames(
          "block h-1 w-3/5 bg-gray-800 rounded-sm transition-all duration-200 origin-right",
          open && ["-rotate-[42deg]", "-translate-x-1"],
        )}
      ></span>
      <span
        className={classNames(
          "block h-1 w-3/5 bg-gray-800 rounded-sm transition-all duration-200",
          open && ["translate-x-full", "opacity-0"],
        )}
      ></span>
      <span
        className={classNames(
          "block h-1 w-3/5 bg-gray-800 rounded-sm transition-all duration-200 origin-right",
          open && ["rotate-[42deg]", "-translate-x-1"],
        )}
      ></span>
    </button>
  );
}

type ToolItemProps = {
  element: JSX.Element | ((isActionPending: boolean) => JSX.Element);
  onClick: (
    isActionPending: boolean,
    setIsActionPending: (value: boolean) => void,
  ) => void;
  className?: string;
};

const ToolItem = memo(function ToolItem(props: ToolItemProps) {
  const { element, onClick, className } = props;
  const [isActionPending, setIsActionPending] = useState(false);
  return (
    <div
      onClick={() => onClick(isActionPending, setIsActionPending)}
      className={classNames(
        "h-[50px] w-[50px] rounded-full shadow-lg mb-3 cursor-pointer",
        className,
      )}
    >
      <button className="h-full w-full flex justify-center items-center pointer-events-none">
        {typeof element === "function" ? element(isActionPending) : element}
      </button>
    </div>
  );
});
