/* eslint-disable @typescript-eslint/no-var-requires*/
process.env.NODE_ENV = "production";

const webpack = require("webpack");

const config = require("../webpack/webpack.config");

const complier = webpack(config);

complier.run((error, result) => {
  if (error) {
    console.error(error);
    return;
  }
  if (result.hasErrors()) {
    console.log(result.toString({ colors: true }));
  }
});
