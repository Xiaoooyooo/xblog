import stream from "stream";
import fs from "fs";
import { FileJSON } from "formidable";
import removeMd from "remove-markdown";
import matter from "gray-matter";
import fileParser from "./fileParser";

class Writer extends stream.Writable {
  private fileInfo: FileJSON | null = null;
  private writer: fs.WriteStream | null = null;
  private parser = new fileParser;
  public blogInfo: Blog = {} as Blog;
  constructor() {
    super();
  }

  initWithFileInfo(fileInfo: FileJSON) {
    this.fileInfo = fileInfo;
    this.writer = fs.createWriteStream(this.fileInfo.filepath);
    return this;
  }

  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    if (!this.writer) {
      throw new Error("writer is not initialize!");
    }
    this.parser.write(chunk);
    this.writer.write(chunk, encoding, callback);
  }

  _final(callback: (error?: Error | null) => void): void {
    if (!this.writer) {
      throw new Error("writer is not initialize!");
    }
    console.log("recieve end");
    this.parser.end(() => {
      const header = matter(this.parser.header.text as string).data as BlogInfo;
      const content = this.parser.text.text as string;
      header.excerpt = removeMd(content, { useImgAltText: false })
        .substring(0, 200);
      this.blogInfo = {
        header,
        content
      };
    });
    this.writer.end(callback);
  }
}

export default Writer;
