import * as fs from "fs";
import * as path from "path";
import Router from "koa-router";
import formidale from "formidable";

import blogWatcher from "../utils/blogWatcher";
import Writer from "../utils/fileWriter";
import { BLOGS_DIR } from "../env";
import findBlogs from "../utils/findBlogs";

const blog = new Router();

blog.get("blog.list", async (ctx) => {
  const { page = 1, size = 10 } = ctx.query;
  ctx.set("content-type", "application/json");
  const blogs = (await findBlogs()).blogs;
  const data = blogs.slice();
  ctx.body = {
    list: data,
    page,
    size,
    total: 100,
  };
});

blog.post("blog.upload", async (ctx, next) => {
  const data = await new Promise<Blog>((resolve, reject) => {
    const writerhandler = new Writer;
    formidale({
      uploadDir: BLOGS_DIR,
      keepExtensions: true,
      filename: (name, ext) => `${name}${ext}`,
      // todo: wait the definition fileupdate
      fileWriteStreamHandler: function(fileInfo: formidale.FileJSON) {
        return writerhandler.initWithFileInfo(fileInfo);
      },
      filter: (part) => {
        // console.log(part);
        if (
          part.originalFilename &&
          !/.+\.md$/.test(part.originalFilename)
        ) {
          return false;
        }
        return true;
      }
    })
      .parse(ctx.req, (err, fields, files) => {
        if (err) console.log(err);
        resolve(writerhandler.blogInfo);
      });
  });
  console.log("parse", data);
  blogWatcher.add(data.header);
  ctx.set("content-type", "application/json");
  ctx.body = data;
});

blog.get("blog.info", async (ctx, next) => {
  const { title } = ctx.query;
  ctx.set("content-type", "application/json");
  console.log(title);
  if (title === "three") {
    ctx.throw(404, "notfound");
  }
  ctx.body = {
    title,
    text: fs.readFileSync(path.resolve(BLOGS_DIR, title as string), "utf-8"),
  };
});

export default blog;
