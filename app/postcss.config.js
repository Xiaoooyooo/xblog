// eslint-disable-next-line
module.exports = (api) => {
  // `api.file` - 文件路径
  // `api.mode` - webpack 的 `mode` 属性值，请查阅 https://webpack.js.org/configuration/mode/
  // `api.webpackLoaderContext` - 在复杂情况下使用的 loader 上下文
  // `api.env` - `api.mode` 的别名，与 `postcss-cli` 兼容
  // `api.options` - `postcssOptions` 的选项
  // console.log("~~~~~~~~~~~~~~~~~~~~~~");
  // console.log(api.file);
  // console.log("~~~~~~~~~~~~~~~~~~~~~~");
  return {
    plugins: {
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
      // "postcss-preset-env": {},
    },
  };
};
