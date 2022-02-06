import fs from "fs";
import { BLOGS_INFO } from "../env";

/**
 * 更新 json 文件
 */
class BlogWatcher {
  /** add a blog */
  add(blogInfo: BlogInfo) {
    const blogsInfo: BlogsInfo = JSON.parse(
      fs.readFileSync(BLOGS_INFO, "utf8")
    );
    if (this.check(blogsInfo, blogInfo.title)) {
      blogsInfo.blogs = blogsInfo.blogs.map(el => {
        if (el.title === blogInfo.title) {
          return blogInfo;
        }
        return el;
      });
    } else {
      blogsInfo.blogs.push(blogInfo);
    }
    this.saveFile(blogsInfo);
  }
  /** delete a blog */
  delete(title: string) {
    const blogsInfo: BlogsInfo = JSON.parse(
      fs.readFileSync(BLOGS_INFO, "utf8")
    );
    blogsInfo.blogs =
      blogsInfo.blogs.filter(blog => blog.title !== title);
    this.saveFile(blogsInfo);
  }
  /** check the blog whether is already exits */
  check(blogsInfo: BlogsInfo, title: string) {
    return blogsInfo.blogs.some(blog => blog.title === title);
  }
  saveFile(blogsInfo: BlogsInfo) {
    fs.writeFileSync(
      BLOGS_INFO,
      JSON.stringify(blogsInfo),
      "utf-8"
    );
  }
}

const blogWatcher = new BlogWatcher;

export default blogWatcher;
