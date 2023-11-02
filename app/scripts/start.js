// eslint-ignore
const webpack = require("webpack");

const config = require("../webpack/webpack.config");

const Serve = require("webpack-dev-server");

const complier = webpack(config);

process.env.NODE_ENV = "development";

const server = new Serve(complier, {
  static: {
    // directory: path.resolve(__dirname, "../dist"),
    watch: true,
  },
  historyApiFallback: true,
  hot: true,
  liveReload: false,
  host: "127.0.0.1",
  port: 8888,
  proxy: {
    "/api": {
      target: "http://127.0.0.1:9999",
    },
  },
});

server.start();
