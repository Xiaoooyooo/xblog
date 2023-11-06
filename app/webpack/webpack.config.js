/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");
const HtmlPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === "production";

/** @type {import("webpack").Configuration} */
const config = {
  mode: isProd ? "production" : "development",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `assets/js/${isProd ? "[contenthash]" : "bundle.[name]"}.js`,
    publicPath: "/",
    // assetModuleFilename: "assets/" // css-loader => 定义全局 asset 资源输出路径
    clean: {},
  },
  devtool: isProd ? false : "inline-source-map",
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".js", ".ts", ".tsx"],
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "babel-loader",
      },
      {
        oneOf: [
          {
            test: /\.scss$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  modules: {
                    localIdentName: `${
                      isProd ? "[hash:base64:5]" : "[name]_[local]"
                    }`,
                  },
                },
              },
              {
                loader: "postcss-loader",
                options: {
                  // execute: true,
                  postcssOptions: {
                    config: true,
                  },
                },
              },
              "sass-loader",
            ],
          },
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
          },
        ],
      },
      {
        test: /\.svg$/,
        use: "@svgr/webpack",
      },
      {
        test: /\.(jpg|png)$/i,
        type: "asset",
        generator: {
          filename: `assets/images/${isProd ? "[contenthash]" : "[name]"}[ext]`,
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `assets/css/${isProd ? "[contenthash]" : "[name]"}.css`,
    }),
    new HtmlPlugin({
      title: "React",
      template: "./public/index.html",
      filename: "index.html",
    }),
    new webpack.DefinePlugin({
      __DEV__: !isProd,
    }),
  ],
};

module.exports = config;
