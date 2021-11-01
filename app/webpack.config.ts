import * as path from "path";
import HtmlPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Configuration } from "webpack";
import "webpack-dev-server";

// 需要安装 ts-node 以使用 ts 配置文件
const config: Configuration = {
  mode: "development",
  entry: "./src/main.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "assets/js/bundle.[fullhash].js",
    publicPath: "/",
    // assetModuleFilename: "assets/" // css-loader => 定义全局 asset 资源输出路径
    clean: {}
  },
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "../public"),
    },
    historyApiFallback: true,
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".js", ".ts", ".tsx"],
    alias: {},
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
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
                localIdentName: "[name]_[local]_[hash:base64:5]",
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
          filename: "assets/images/[name].[hash][ext]"
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/css/[name]_[fullhash].css"
    }),
    new HtmlPlugin({
      title: "React",
      template: "./public/index.html",
      filename: "index.html"
    })
  ]
};

export default config;