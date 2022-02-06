import fs from "fs";
import { BLOGS_INFO } from "../env";

export default function findBlogs(): Promise<BlogsInfo> {
  return new Promise<BlogsInfo>((resolve, reject) => {
    fs.readFile(BLOGS_INFO, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data) as BlogsInfo);
      }
    });
  });
}