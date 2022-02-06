// 环境配置
import path from "path";

export const isProd = process.env.NODE_ENV === "production";

export const ROOT = __dirname;

export const WWW = path.resolve(__dirname, "WWW");

// 数据文件夹
export const DATA_DIR = path.resolve(ROOT, "data");

// 博客文件夹
export const BLOGS_DIR = path.resolve(DATA_DIR, "blogs");
export const FILES_INFO = path.resolve(DATA_DIR, "data.json");

// 个人信息文件夹
export const ABOUT_ME = path.resolve(DATA_DIR, "about");

export const PORT = 9999;
