import { useState, useCallback, useRef } from "react";
import Select, { SelectItem, SelectItemOption } from "@/components/Select";
import InfiniteScroll from "./InfiniteScroll";
import { getCategories } from "@/services/functions/categories";
import debounce from "@/utils/debounce";
import { Category } from "@/types";
import LoadingIcon from "@/assets/icons/circle-loading.svg";

type CategorySelectProps = {
  categories: SelectItemOption[];
  onCategoriesChange: (value: SelectItemOption[]) => void;
};

export default function CategorySelect(props: CategorySelectProps) {
  const { categories, onCategoriesChange } = props;
  const [isGetCategoriesListLoading, setIsGetCategoriesLoading] =
    useState(false);
  const [isContinueLoading, setIsContinueLoading] = useState(false);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const searchKeywordsRef = useRef("");

  const [categoryListPagination, setCategoryListPagination] = useState({
    index: 1,
    size: 10,
    end: false,
  });

  /**
   * @param {boolean} isContinue 是否是滚动继续加载
   */
  const getCategoryList = useCallback(
    (
      isContinue: boolean,
      search: { name: string; pageIndex: number; pageSize: number },
    ) => {
      if (isContinue) {
        setIsContinueLoading(true);
      } else {
        setCategoryList([]);
        setIsGetCategoriesLoading(true);
        setCategoryListPagination({ index: 1, size: 10, end: false });
      }
      getCategories(search)
        .then((res) => {
          const { list, index, size } = res;
          if (isContinue) {
            setCategoryList((p) => [...p, ...list]);
            setCategoryListPagination((p) => ({ ...p, index }));
            if (list.length < size) {
              setCategoryListPagination((p) => ({ ...p, end: true }));
            }
          } else {
            setCategoryList(list);
          }
        })
        .finally(() => {
          if (isContinue) {
            setIsContinueLoading(false);
          } else {
            setIsGetCategoriesLoading(false);
          }
        });
    },
    [],
  );

  const debouncedInputCallback = useCallback(
    debounce(function (name: string) {
      searchKeywordsRef.current = name;
      getCategoryList(false, { name, pageIndex: 1, pageSize: 10 });
    }, 800),
    [],
  );

  const handleScrollLoadData = useCallback(() => {
    const { index, size } = categoryListPagination;
    getCategoryList(true, {
      name: searchKeywordsRef.current,
      pageIndex: index + 1,
      pageSize: size,
    });
  }, [categoryListPagination]);

  const handleCategoryDropDownVisibleChange = useCallback(
    (visible: boolean) => {
      if (visible) {
        if (categoryList.length === 0) {
          getCategoryList(false, { name: "", pageIndex: 1, pageSize: 10 });
        }
      }
    },
    [categoryList],
  );

  const handleCreateCatecoryTag = useCallback((value: SelectItemOption) => {
    console.log("handleCreateCatecoryTag", { value });
  }, []);

  return (
    <Select
      multiple
      allowCreate
      value={categories}
      onChange={onCategoriesChange}
      onSelect={(v) => console.log("select", v)}
      onInput={debouncedInputCallback}
      onDropDownVisibleChange={handleCategoryDropDownVisibleChange}
      onCreate={handleCreateCatecoryTag}
      placeholder="选择或创建文章分类"
    >
      {categoryList.length === 0 && isGetCategoriesListLoading ? (
        <div className="p-4 relative">
          <LoadingIcon
            height={22}
            width={22}
            className="absolute left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      ) : categoryList.length > 0 ? (
        <InfiniteScroll
          className="max-h-[300px] overflow-auto"
          allowExec={
            !isGetCategoriesListLoading &&
            !isContinueLoading &&
            !categoryListPagination.end
          }
          execFn={handleScrollLoadData}
        >
          {categoryList.map((el) => (
            <SelectItem key={el.id} item={{ label: el.name, value: el.id }} />
          ))}
          {isContinueLoading && (
            <div className="p-1 flex justify-center items-center">
              <LoadingIcon />
            </div>
          )}
        </InfiniteScroll>
      ) : (
        <div className="p-4 text-center text-gray-400">没有数据</div>
      )}
    </Select>
  );
}
