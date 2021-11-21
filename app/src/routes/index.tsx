import React, { ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Link
  Navigate
} from "react-router-dom";

import BaseLayout from "layouts";
// import Login from "views/Login";
import Home from "views/Home";
import Blog from "views/Blog";
import About from "views/About";

export default class App extends React.Component {
  render(): ReactNode {
    return (
      <Router basename="/">
        <BaseLayout>
          <Routes>
            <Route path="home" element={<Home />}>
              <Route path=":page" element={<Home />}></Route>
            </Route>
            <Route path="blog/:blogId" element={<Blog />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<Navigate to="home" replace />} />
          </Routes>
        </BaseLayout>
      </Router>
    );
  }
}