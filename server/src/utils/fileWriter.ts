import stream from "stream";
import fs from "fs";
import { FileJSON } from "formidable";
import matter from "gray-matter";
import fileParser from "./fileParser";

class Writer extends stream.Writable {
  private fileInfo: FileJSON | null = null;
  private writer: fs.WriteStream | null = null;
  private parser = new fileParser;
  public blogInfo: {
    header?: {
      [key: string]: string
    };
    text?: string;
  } = {};
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
      this.blogInfo = {
        header: matter(this.parser.header.text as string).data,
        text: this.parser.text.text
      };
    });
    this.writer.end(callback);
  }
}

export default Writer;
