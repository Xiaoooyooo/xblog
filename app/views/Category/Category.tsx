import { useState, useCallback, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ContentContainer from "@/components/ContentContainer";
import Background from "@/components/Background";
import { useGatCategoryDocuments, useGetCategories } from "@/services/category";
import CategorySkeleton from "./CategorySkeleton";
import Pagination from "@/components/Pagination";
import InfiniteScroll from "@/components/InfiniteScroll";
import Input from "@/components/Input";
import Empty from "@/components/Empty";
import { List, ListItem } from "@/components/List";
import debounce from "@/utils/debounce";
import SearchIcon from "@/assets/icons/search.svg";

export default function CategoryScene() {
  const params = useParams();
  const navigate = useNavigate();
  const currentPage = parseInt(params.pageIndex || "1");
  const [pagination, setPagination] = useState({ total: 0 });
  const [searchKeywords, setSearchKeywords] = useState("");
  const { isSuccess, isLoading, result } = useGetCategories(
    currentPage,
    10,
    searchKeywords,
    true,
  );

  const handleSearchInput = useCallback(
    debounce((input: string) => {
      console.log({ input });
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

  console.log({ params, isSuccess, isLoading, result });

  return (
    <ContentContainer>
      <div className="mt-10">
        <Input
          className="block w-3/5 m-auto text-xl p-3 rounded-full"
          placeholder="输入关键字搜索"
          prefix={<SearchIcon height={20} width={20} />}
          onInput={handleSearchInput}
        />
      </div>
      <div className="mt-20">
        {isLoading ? (
          <CategorySkeleton />
        ) : result && result.list.length !== 0 ? (
          <List>
            {result.list.map((item) => (
              <ListItem key={item.id} className="mb-4 p-2">
                <Link to={{ pathname: `/category/${item.id}` }}>
                  <div className="text-xl">{item.name}</div>
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
