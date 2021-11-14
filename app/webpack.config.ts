import * as path from "path";
import HtmlPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Configuration } from "webpack";
import "webpack-dev-server";

import { isProd as envIsProd } from "./src/config/env";

type Mode = "development" | "production";
function config(mode: Mode) {
  const isProd = envIsProd || mode === "production";
  console.log("isProduction?", isProd);
  // 需要安装 ts-node 以使用 ts 配置文件
  const config: Configuration = {
    mode: isProd ? "production" : "development",
    entry: "./src/main.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: `assets/js/${isProd ? "[contenthash]" : "bundle.[name]"}.js`,
      publicPath: "/",
      // assetModuleFilename: "assets/" // css-loader => 定义全局 asset 资源输出路径
      clean: {}
    },
    devtool: "inline-source-map",
    devServer: {
      static: {
        directory: path.resolve(__dirname, "../dist"),
        watch: true,
      },
      historyApiFallback: true,
      hot: true,
      liveReload: false,
      host: "127.0.0.1",
      port: 8888
    },
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
      extensions: [".js", ".ts", ".tsx"],
      alias: {},
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "babel-loader"
        },
        {
          test: /\.s?css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: `${isProd
                    ? "[hash:base64:5]"
                    : "[name]_[local]"
                  }`,
                },
              }
            },
            {
              loader: "postcss-loader",
              options: {
                // execute: true,
                postcssOptions: {
                  config: true
                }
              }
            },
            "sass-loader"
          ]
        },
        {
          test: /\.(jpg|png)$/i,
          type: "asset",
          generator: {
            filename: `assets/images/${isProd
              ? "[contenthash]"
              : "[name]"
            }[ext]`
          }
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `assets/css/${isProd ? "[contenthash]" : "[name]"}.css`
      }),
      new HtmlPlugin({
        title: "React",
        template: "./public/index.html",
        filename: "index.html"
      })
    ]
  };
  return config;
}

export default function (env: unknown, argv: { mode: Mode }) {
  console.log(env, argv);
  return config(argv.mode);
}
