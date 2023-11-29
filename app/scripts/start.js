/* eslint-disable @typescript-eslint/no-var-requires*/
require("dotenv").config();
process.env.NODE_ENV = "development";

const path = require("path");
const webpack = require("webpack");

const config = require("../webpack/webpack.config");

const Serve = require("webpack-dev-server");

const complier = webpack(config);

const server = new Serve(
  {
    static: {
      directory: path.resolve(process.cwd(), "app/public"),
      watch: true,
    },
    historyApiFallback: true,
    hot: true,
    liveReload: false,
    host: "0.0.0.0",
    port: 8888,
    proxy: {
      "/api": {
        target: `http://127.0.0.1:${parseInt(process.env.PORT)}`,
      },
    },
  },
  complier,
);

server.start();
