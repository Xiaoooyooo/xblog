const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

var config;
if (process.env.NODE_ENV === "production") {
	config = {}
} else {
	config = require("./config/webpack.dev");
}

module.exports = Object.assign({
	entry: "./src/main.tsx",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.[fullhash].js",
	},
	resolve: {
		extensions: [".scss", ".js", ".ts", ".tsx"],
		alias: {
			"views": path.resolve(__dirname, "src/views"),
			"routes": path.resolve(__dirname, "src/routes")
		}
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
					"style-loader",
					{
						loader: "css-loader",
						options: {
							modules: {
								localIdentName: '[name]_[local]_[hash:base64:5]',
							},
						}
					},
					"postcss-loader",
					"sass-loader"
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin,
		new HtmlPlugin({
			title: "React",
			template: "./public/index.html",
			filename: "index.html"
		})
	]
}, config);