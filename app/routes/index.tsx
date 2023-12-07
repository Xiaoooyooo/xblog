import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

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

export default createBrowserRouter(
  [
    {
      element: (
        <Suspense fallback={<Progress />}>
          <BaseLayout />
        </Suspense>
      ),
      children: [
        {
          path: "",
          index: true,
          element: <HomeScene />,
        },
        {
          path: "page/:pageIndex",
          index: true,
          element: <HomeScene />,
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
          path: "new",
          element: <CreateScene />,
        },
        {
          path: "edit/:blogId",
          element: <EditScene />,
        },
        {
          path: "about",
          element: <AboutScene />,
        },
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
      element: <h2>Not Found</h2>,
    },
  ],
  { basename: "/" },
);
