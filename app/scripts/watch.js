/* eslint-disable @typescript-eslint/no-var-requires*/
process.env.NODE_ENV = "development";

const webpack = require("webpack");

const config = require("../webpack/webpack.config");

webpack(
  {
    ...config,
    watch: true,
    watchOptions: { ignored: /[\\/](node_modules|build|server)[\\/]/ },
  },
  (error, stats) => {
    if (error) {
      console.error(error);
      return;
    }
    const str = stats.toString({ colors: true });
    if (str) {
      console.log(str);
    }
  },
);
