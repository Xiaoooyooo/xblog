import fs from "fs";
import { FILES_INFO } from "../env";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const filesInfo = require(FILES_INFO);
/**
 * 更新 json 文件
 */
interface BlogInfo {
  title: string;
  img?: string;
  createdAt: string;
  updatedAt: string;
}
class BlogWatcher {
  blogsInfo: {
    blogs: BlogInfo[],
    about: any;
  };
  constructor() {
    this.blogsInfo = filesInfo;
  }
  /** add a blog */
  add(fileInfo: BlogInfo) {
    console.log("add file", fileInfo);
    this.blogsInfo.blogs.push(fileInfo);
    console.log(this.blogsInfo);
    this.saveFile();
  }
  /** delete a blog */
  delete(title: string) {
    this.blogsInfo.blogs =
      this.blogsInfo.blogs.filter(blog => blog.title !== title);
    this.saveFile();
  }
  /** check the blog whether is already exits */
  check(title: string) {
    return this.blogsInfo.blogs.some(blog => blog.title === title);
  }
  saveFile() {
    console.log("saveFile");
    fs.writeFileSync(
      FILES_INFO,
      JSON.stringify(this.blogsInfo, null, 2),
      "utf-8"
    );
  }
}

const blogWatcher = new BlogWatcher;

export default blogWatcher;
