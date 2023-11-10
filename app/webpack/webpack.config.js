/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");
const HtmlPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === "production";
const cwd = process.cwd();

/** @type {import("webpack").Configuration} */
const config = {
  mode: isProd ? "production" : "development",
  entry: path.resolve(cwd, "app/index.tsx"),
  output: {
    path: path.resolve(cwd, "build/app"),
    filename: `assets/js/${isProd ? "[contenthash]" : "bundle.[name]"}.js`,
    publicPath: "/",
    // assetModuleFilename: "assets/" // css-loader => 定义全局 asset 资源输出路径
    clean: {},
  },
  devtool: isProd ? false : "inline-source-map",
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    alias: {
      "@": path.resolve(cwd, "app"),
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
        loader: "@svgr/webpack",
        options: {
          svgoConfig: {
            plugins: [
              {
                name: "preset-default",
                params: {
                  overrides: {
                    // viewBox is required to resize SVGs with CSS.
                    // @see https://github.com/svg/svgo/issues/1128
                    removeViewBox: false,
                  },
                },
              },
            ],
          },
        },
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
      template: path.resolve(cwd, "app/public/index.html"),
      filename: "index.html",
    }),
    new webpack.DefinePlugin({
      __DEV__: !isProd,
    }),
  ],
};

module.exports = config;
