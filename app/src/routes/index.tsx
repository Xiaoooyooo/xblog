import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import BaseLayout from "@/layouts";
// import Login from "views/Login";
const HomeScence = lazy(() => import("@/views/Home/Home"));
const BlogScence = lazy(() => import("@/views/Blog"));
const EditScence = lazy(() => import("@/views/Edit/Edit"));
const AboutScence = lazy(() => import("@/views/About"));

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
          element: <HomeScence />,
        },
        {
          path: "page/:pageIndex",
          index: true,
          element: <HomeScence />,
        },
        {
          path: "blog/:blogId",
          element: <BlogScence />,
        },
        {
          path: "edit/?:blogId",
          element: <EditScence />,
        },
        {
          path: "about",
          element: <AboutScence />,
        },
        {
          path: "*",
          element: <h2>Not Found</h2>,
        },
      ],
    },
  ],
  { basename: "/" },
);
