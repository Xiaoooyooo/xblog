import { createBrowserRouter } from "react-router-dom";

import BaseLayout from "@/layouts";
// import Login from "views/Login";
import Home from "@/views/Home/Home";
import Blog from "@/views/Blog";
import About from "@/views/About";

export default createBrowserRouter(
  [
    {
      element: <BaseLayout />,
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
        {
          path: "*",
          element: <h2>Not Found</h2>,
        },
      ],
    },
  ],
  { basename: "/" },
);
