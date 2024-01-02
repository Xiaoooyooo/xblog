import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "@/hooks/redux";
import { useGetCategories } from "@/services/category";
import ContentContainer from "@/components/ContentContainer";
import CategorySkeleton from "./CategorySkeleton";
import Pagination from "@/components/Pagination";
import Input from "@/components/Input";
import Empty from "@/components/Empty";
import { List, ListItem } from "@/components/List";
import { MenuItem, MenuTrigger } from "@/components/Menu";
import CategoryMenu from "./CategoryMenu";
import debounce from "@/utils/debounce";
import SearchIcon from "@/assets/icons/search.svg";
import TreeDotIcon from "@/assets/icons/three-dot.svg";

export default function CategoryScene() {
  const user = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const currentPage = parseInt(params.pageIndex || "1");
  const [pagination, setPagination] = useState({ total: 0 });
  const [searchKeywords, setSearchKeywords] = useState("");
  const memozied = useMemo(
    () => ({
      pageIndex: currentPage,
      pageSize: 10,
      name: searchKeywords,
      documents: true,
    }),
    [currentPage, searchKeywords],
  );

  const { isSuccess, isLoading, result, reload } = useGetCategories(memozied);

  const handleSearchInput = useCallback(
    debounce((input: string) => {
      navigate({ pathname: "/category" });
      setSearchKeywords(input);
    }, 500),
    [],
  );

  useEffect(() => {
    if (isSuccess && result) {
      setPagination({ total: result.total });
    }
  }, [isSuccess, result]);

  return (
    <ContentContainer>
      <div className="mt-10 flex justify-center">
        <Input
          className="w-5/6 px-2 md:w-3/5 md:p-3 text-base md:text-xl m-auto rounded-full"
          placeholder="输入关键字搜索"
          prefix={<SearchIcon height={20} width={20} />}
          onInput={handleSearchInput}
        />
      </div>
      <div className="mt-10 md:mt-20">
        {isLoading ? (
          <CategorySkeleton />
        ) : result && result.list.length !== 0 ? (
          <List>
            {result.list.map((item) => (
              <ListItem key={item.id} className="mb-4 p-2">
                <Link to={{ pathname: `/category/${item.id}` }}>
                  <div className="flex items-center gap-x-4">
                    <div className="text-xl">{item.name}</div>
                    {user.isLogin && (
                      <div>
                        <MenuTrigger
                          menu={
                            <CategoryMenu category={item} reload={reload} />
                          }
                        >
                          <TreeDotIcon />
                        </MenuTrigger>
                      </div>
                    )}
                  </div>
                  <div className="text-sm">共有 {item.documents} 篇文章</div>
                </Link>
              </ListItem>
            ))}
          </List>
        ) : (
          <Empty />
        )}
        <Pagination
          href={(page: number) =>
            page === 1 ? "/category" : `/category/page/${page}`
          }
          pageIndex={currentPage}
          pageSize={10}
          total={pagination.total}
        />
      </div>
    </ContentContainer>
  );
}
