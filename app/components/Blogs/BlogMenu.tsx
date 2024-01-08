import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Blog } from "@/types";
import { MenuItem } from "../Menu";
import EditIcon from "@/assets/icons/edit.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import LoadingIcon from "@/assets/icons/circle-loading.svg";
import { useSelector } from "@/hooks/redux";
import { useDeleteBlog } from "@/services/blog";
import message from "../Message/message";

type BlogMenuProps = {
  blog: Blog;
  reload: () => void;
};

export default function BlogMenu(props: BlogMenuProps) {
  const { blog, reload } = props;
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const { isLoading: isDeleting, fetchFn: deleteBlog } = useDeleteBlog();

  const handleDelete = useCallback(() => {
    if (isDeleting) {
      return;
    }
    deleteBlog(blog.id).then((res) => {
      if (res.isSuccess) {
        reload();
      }
      if (res.isError) {
        message({ type: "error", message: "删除文章失败" });
      }
    });
  }, [blog.id, isDeleting, deleteBlog, reload]);

  return (
    <>
      {user.id === blog.user.id && (
        <MenuItem
          icon={<EditIcon />}
          onClick={() => navigate({ pathname: `blog/${blog.id}/edit` })}
        >
          编辑
        </MenuItem>
      )}
      {user.id === blog.user.id && (
        <MenuItem
          icon={isDeleting ? <LoadingIcon /> : <TrashIcon />}
          onClick={handleDelete}
        >
          删除
        </MenuItem>
      )}
    </>
  );
}
