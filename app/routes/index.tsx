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
import ROLE from "@@/constants/role";

const Authentication = lazy(() => import("@/views/Authentication"));
const Home = lazy(() => import("@/views/Home"));
const Blog = lazy(() => import("@/views/Blog"));
const Create = lazy(() => import("@/views/Create"));
const Edit = lazy(() => import("@/views/Edit"));
const Category = lazy(() => import("@/views/Category"));
const CategoryDetail = lazy(() => import("@/views/CategoryDetail"));
const Profile = lazy(() => import("@/views/Profile"));
const Admin = lazy(() => import("@/views/Admin"));

function createRouter(user: RootState["user"]) {
  const authenticatedRoutes: RouteObject[] = [
    {
      path: "blog/new",
      element: <Create />,
    },
    {
      path: "blog/:blogId/edit",
      element: <Edit />,
    },
    {
      path: "draft",
      children: [
        {
          path: "",
          index: true,
          element: <Home isDraft />,
        },
        {
          path: "page/:pageIndex",
          element: <Home isDraft />,
        },
      ],
    },
  ];

  const administratorRoutes: RouteObject[] = [
    {
      path: "admin",
      element: <Admin />,
    },
  ];

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
              element: <Home />,
            },
            {
              path: "page/:pageIndex",
              element: <Home />,
            },
          ],
        },
        {
          path: "blog/:blogId",
          element: <Blog />,
        },
        {
          path: "category",
          element: <Category />,
        },
        {
          path: "category/page/:pageIndex",
          element: <Category />,
        },
        {
          path: "category/:categoryId",
          element: <CategoryDetail />,
        },
        {
          path: "category/:categoryId/page/:pageIndex",
          element: <CategoryDetail />,
        },
        {
          path: "user/:userId",
          element: <Profile />,
        },
        // protected routes
        ...(user.isLogin ? authenticatedRoutes : []),
        // super administrator routes
        ...(user.isLogin && user.role === ROLE.SUPERADMIN
          ? administratorRoutes
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
