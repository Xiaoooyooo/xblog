import { lazy, Suspense, useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from "react-router-dom";
import { useSelector } from "@/hooks/redux";
import { RootState } from "@/redux";
import BaseLayout from "@/layouts";
import Progress from "@/components/Progress";

const Authentication = lazy(() => import("@/views/Authentication"));
const HomeScene = lazy(() => import("@/views/Home"));
const BlogScene = lazy(() => import("@/views/Blog"));
const AboutScene = lazy(() => import("@/views/About"));
const CreateScene = lazy(() => import("@/views/Create"));
const EditScene = lazy(() => import("@/views/Edit"));
const CategoryScene = lazy(() => import("@/views/Category"));
const CategoryDetailScene = lazy(() => import("@/views/CategoryDetail"));
const ProfileDetailScene = lazy(() => import("@/views/Profile"));

function createRouter(user: RootState["user"]) {
  const routes: RouteObject[] = [
    {
      element: (
        <Suspense fallback={<Progress />}>
          <BaseLayout />
        </Suspense>
      ),
      children: [
        {
          path: "",
          children: [
            {
              path: "",
              index: true,
              element: <HomeScene />,
            },
            {
              path: "page/:pageIndex",
              element: <HomeScene />,
            },
          ],
        },
        {
          path: "blog/:blogId",
          element: <BlogScene />,
        },
        {
          path: "category",
          element: <CategoryScene />,
        },
        {
          path: "category/page/:pageIndex",
          element: <CategoryScene />,
        },
        {
          path: "category/:categoryId",
          element: <CategoryDetailScene />,
        },
        {
          path: "category/:categoryId/page/:pageIndex",
          element: <CategoryDetailScene />,
        },
        {
          path: "user/:userId",
          element: <ProfileDetailScene />,
        },
        {
          path: "about",
          element: <AboutScene />,
        },
        // protected routes
        ...(user.isLogin
          ? [
              {
                path: "new",
                element: <CreateScene />,
              },
              {
                path: "edit/:blogId",
                element: <EditScene />,
              },
              {
                path: "draft",
                children: [
                  {
                    path: "",
                    index: true,
                    element: <HomeScene />,
                  },
                  {
                    path: "page/:pageIndex",
                    element: <HomeScene />,
                  },
                ],
              },
            ]
          : []),
      ],
    },
    {
      path: "auth/:authType",
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <Authentication />
        </Suspense>
      ),
    },
    {
      path: "*",
      element: user.fetching ? <Progress /> : <div>not found</div>,
    },
  ];
  return createBrowserRouter(routes, { basename: "/" });
}

export default function Routes() {
  const user = useSelector((state) => state.user);
  const [router, setRouter] = useState(createRouter(user));

  useEffect(() => {
    setRouter(createRouter(user));
  }, [user]);

  return <RouterProvider router={router} />;
}
