import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Category } from "@/types";
import { MenuItem } from "@/components/Menu";
import { deleteCategory } from "@/services/functions/categories";
import EditIcon from "@/assets/icons/edit.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import LoadingIcon from "@/assets/icons/circle-loading.svg";
import { useSelector } from "@/hooks/redux";

type BlogMenuProps = {
  category: Category;
  reload: () => void;
};

export default function CategoryMenu(props: BlogMenuProps) {
  const { category, reload } = props;
  const user = useSelector((state) => state.user);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(() => {
    if (isDeleting) {
      return;
    }
    setIsDeleting(true);
    deleteCategory(category.id, user.token)
      .then((res) => {
        if (res) {
          // todo alert
          reload();
        }
      })
      .finally(() => {
        setIsDeleting(false);
      });
  }, [category.id, user.token]);

  return (
    <>
      {user.id === category.createdBy.id && (
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
