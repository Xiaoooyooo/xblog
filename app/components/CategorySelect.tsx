import { useCallback } from "react";
import Select, { SelectItemOption } from "@/components/Select";
import { useGetCategories } from "@/services/category";

type CategorySelectProps = {
  categories: SelectItemOption[];
  onCategoriesChange: (value: SelectItemOption[]) => void;
};

export default function CategorySelect(props: CategorySelectProps) {
  const { categories, onCategoriesChange } = props;
  const {
    isLoading: isGetCateroiesLoading,
    isSuccess: isGetCategoriesSuccess,
    result: getCategoriesResult,
    fetchFn: getCategoriesFn,
  } = useGetCategories();

  const handleCategorySelectInput = useCallback((input: string) => {
    console.log({ input });
  }, []);

  const handleCategoryDropDownVisibleChange = useCallback(
    (visible: boolean) => {
      console.log({ visible });
      if (visible) {
        getCategoriesFn({ name: "" }).then((res) => {
          console.log({ res });
        });
      } else {
        // todo: cancel pending request
      }
    },
    [],
  );

  const handleCreateCatecoryTag = useCallback((value: SelectItemOption) => {
    console.log("handleCreateCatecoryTag", { value });
  }, []);

  return (
    <Select
      multiple
      allowCreate
      value={categories}
      option={
        getCategoriesResult?.list.map((el) => ({
          label: el.name,
          value: el.id,
        })) || []
      }
      onChange={onCategoriesChange}
      onSelect={(v) => console.log("select", v)}
      onInput={handleCategorySelectInput}
      onDropDownVisibleChange={handleCategoryDropDownVisibleChange}
      loading={isGetCateroiesLoading}
      onCreate={handleCreateCatecoryTag}
      placeholder="选择或创建文章分类"
    />
  );
}
