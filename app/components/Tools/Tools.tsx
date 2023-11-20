import { useRef, useState, ReactNode, useMemo, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  useMatch,
  useParams,
} from "react-router-dom";
import classNames from "classnames";
import { Transition } from "../Transition";
import EditIcon from "@/assets/icons/edit.svg";
import CreateIcon from "@/assets/icons/add.svg";

type ToolItem = {
  id: string;
  element: ReactNode;
  onClick?: () => void;
  visible?: boolean | (() => boolean);
};

type ToolProps = {
  //
};

export default function Tools(props: ToolProps) {
  const actionListElRef = useRef<HTMLDivElement>(null);
  const [isShowTools, setIsShowTools] = useState(false);
  const navigate = useNavigate();
  const matchBlogDetailPage = useMatch("/blog/:id");
  const params = useParams();
  const items = useMemo<ToolItem[]>(() => {
    return [
      {
        id: "create",
        element: (
          <button className="h-full w-full flex justify-center items-center">
            <CreateIcon className="h-7 w-7" />
          </button>
        ),
        onClick: function () {
          console.log("create");
          navigate({ pathname: "/edit" });
        },
      },
      {
        id: "edit",
        element: (
          <button className="h-full w-full flex justify-center items-center">
            <EditIcon className="h-7 w-7" />
          </button>
        ),
        onClick: function () {
          console.log("edit", params);
          navigate({ pathname: `/edit/${params.blogId}` });
        },
        visible: () => !!matchBlogDetailPage,
      },
    ];
  }, [matchBlogDetailPage, params]);

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
    <div id="tools" className="fixed right-[60px] bottom-[60px] ">
      <div>
        <ToolButton
          onClick={() => setIsShowTools(!isShowTools)}
          open={isShowTools}
        />
      </div>

      <div className="absolute bottom-full" ref={actionListElRef}>
        {items
          .filter((item) => {
            if (typeof item.visible === "undefined") {
              return true;
            }
            if (typeof item.visible === "function") {
              return item.visible();
            }
            return item.visible;
          })
          .map(({ id, element, onClick }) => (
            <Transition
              key={id}
              show={isShowTools}
              duration={200}
              beforeEnterClassName="opacity-0 scale-75"
              enterActiveClassName="transition-all duration-200"
              enterDoneClassName=""
              beforeLeaveClassName="opacity-100"
              leaveActiveClassName="transition-all duration-200"
              leaveDoneClassName="opacity-0 scale-75"
              unmountOnHide
            >
              <div
                onClick={() => {
                  setIsShowTools(false);
                  onClick?.();
                }}
                className="h-[50px] w-[50px] rounded-full shadow-lg mb-3"
              >
                {element}
              </div>
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
