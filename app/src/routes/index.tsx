import React, { ReactNode } from "react";
import {
  BrowserRouter as Router,
  // HashRouter as Router,
  Switch,
  Route,
  Redirect,
  // Link
} from "react-router-dom";

import Layout from "components/Layout";
import Login from "views/Login";

export default class App extends React.Component {
  render(): ReactNode {
    return (
      <>
        <Router>
          <Layout>
            <Switch>
              <Redirect exact from="/" to="/login" />
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/login/:id">
                <div>this is another route.{''}</div>
              </Route>
            </Switch>
          </Layout>
        </Router>
      </>
    );
  }
}