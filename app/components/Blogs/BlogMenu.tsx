import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Blog } from "@/types";
import { MenuItem } from "../Menu";
import { deleteBlog } from "@/services/functions/blog";
import EditIcon from "@/assets/icons/edit.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import LoadingIcon from "@/assets/icons/circle-loading.svg";
import { useSelector } from "@/hooks/redux";

type BlogMenuProps = {
  blog: Blog;
  reload: () => void;
};

export default function BlogMenu(props: BlogMenuProps) {
  const { blog, reload } = props;
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(() => {
    if (isDeleting) {
      return;
    }
    setIsDeleting(true);
    deleteBlog(blog.id, user.token)
      .then((res) => {
        if (res) {
          // todo alert
          reload();
        }
      })
      .finally(() => {
        setIsDeleting(false);
      });
  }, [blog.id, user.token]);

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
