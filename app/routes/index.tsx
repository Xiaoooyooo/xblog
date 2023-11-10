import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import BaseLayout from "@/layouts";
const Home = lazy(() => import("@/views/Home"));
const Blog = lazy(() => import("@/views/Blog"));
const About = lazy(() => import("@/views/About"));
const Authentication = lazy(() => import("@/views/Authentication"));

export default createBrowserRouter(
  [
    {
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <BaseLayout />
        </Suspense>
      ),
      children: [
        {
          path: "",
          index: true,
          element: <Home />,
        },
        {
          path: "page/:pageIndex",
          index: true,
          element: <Home />,
        },
        {
          path: "blog/:blogId",
          element: <Blog />,
        },
        {
          path: "about",
          element: <About />,
        },
      ],
    },
    {
      path: "auth",
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
