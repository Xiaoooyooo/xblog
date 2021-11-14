import React, { ReactNode } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  // Link
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
          <Switch>
            <Redirect exact from="/" to="/home" />
            <Route exact path="/home/:page(\d+)?">
              <Home />
            </Route>
            <Route exact path="/blog/:blogId">
              <Blog />
            </Route>
            <Route exact path="/about">
              <About />
            </Route>
            {/* <Redirect exact from="/" to="/login" />
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/login/:id">
                <div>this is another route.{''}</div>
              </Route> */}
          </Switch>
        </BaseLayout>
      </Router>
    );
  }
}