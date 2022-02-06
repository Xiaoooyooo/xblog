/**
 * ??? 用正则还是 stream buffer 呢 ?
 */
/* eslint-disable no-fallthrough */
import { EventEmitter } from "events";
import stream from "stream";

const HYPHEN = 45;
const CR = 13;
const LF = 10;

const STATES = {
  UNINITIALIZE: 0,
  START: 1,
  HEADER_START: 2,
  HEADER: 3,
  TEXT_START: 4,
  TEXT: 5
};

class Parser extends stream.Transform {
  header = new Part(true);
  text = new Part;
  yamlBoundary = Buffer.from("---\r\n");
  index = 0;
  state = STATES.UNINITIALIZE;
  headerMarker: number | undefined = undefined;
  textMarker: number | undefined = undefined;
  flag = 0;
  constructor() {
    super();
    this.state = STATES.START;
  }

  setHeaderMarker(position: number) {
    this.headerMarker = position;
    console.log("set header mark", position);
  }

  pushHeader(chunk: Buffer, end: number) {
    if (this.headerMarker !== undefined) {
      this.header.emit("data", chunk.slice(this.headerMarker, end));
      this.headerMarker = undefined;
    } else {
      this.header.emit("data", chunk.slice(0, end));
    }
  }

  pushText(chunk: Buffer, end: number) {
    if (this.textMarker !== undefined) {
      this.text.emit("data", chunk.slice(this.textMarker, end));
      this.textMarker = undefined;
    } else {
      this.text.emit("data", chunk.slice(0, end));
    }
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: stream.TransformCallback
  ): void {
    const { yamlBoundary } = this;
    let { state, index, flag } = this;
    const bufferLength = chunk.length;
    let i: number, c: number;
    console.log("chunk", chunk);

    for (i = 0; i < bufferLength; i++) {
      c = chunk[i];
      switch (state) {
        case STATES.UNINITIALIZE: {
          return;
        }
        case STATES.START: {
          if (c === yamlBoundary[i]) {
            break;
          }
          if (i === yamlBoundary.length) {
            state = STATES.HEADER_START;
          } else {
            return;
          }
        }
        case STATES.HEADER_START: {
          this.setHeaderMarker(i);
          state = STATES.HEADER;
        }
        case STATES.HEADER: {
          const prevIndex = index;
          index = 0;
          if (flag !== 2) {
            if (prevIndex) {
              console.log("prevIndex", prevIndex);
              while (chunk[i + index] && prevIndex + index < yamlBoundary.length) {
                if (chunk[i + index] !== yamlBoundary[prevIndex + index]) {
                  flag = 0;
                  index = 0;
                  break;
                }
                index++;
              }
              if (flag === 1) {
                i += index;
                index += prevIndex;
              }
            } else {
              if (c === HYPHEN) {
                index = 0;
                flag = 1;
                while (chunk[i + index] && yamlBoundary[index]) {
                  if (chunk[i + index] !== yamlBoundary[index]) {
                    flag = 0;
                    index = 0;
                    break;
                  }
                  index++;
                }
                if (flag !== 0) {
                  console.log("ii", i);
                  i += index;
                  console.log("i1", i, index);
                }
              }
            }
          }
          if (flag === 1 && index === yamlBoundary.length) {
            // 匹配到结尾
            flag = 2;
            this.pushHeader(chunk, i);
            console.log("i", i);
            this.header.emit("end");
            state = STATES.TEXT_START;
            i--;
            break;
          }
          if (i === bufferLength - 1) {
            this.pushHeader(chunk, bufferLength);
          }
          break;
        }
        case STATES.TEXT_START: {
          if (c === CR || c === LF) break;
          this.textMarker = i;
          state = STATES.TEXT;
        }
        case STATES.TEXT: {
          if (i === bufferLength - 1) {
            this.pushText(chunk, bufferLength);
          }
          break;
        }
      }
    }
    this.state = state;
    this.index = index;
    this.flag = flag;
    callback();
  }
  _flush(callback: stream.TransformCallback): void {
    console.log("~~~~~~~~~~~");
    this.text.emit("end");
    callback();
  }
}

class Part extends EventEmitter {
  buffer: Buffer;
  isHeader: boolean;
  text: string | undefined;
  constructor(isHeader = false) {
    super();
    this.buffer = Buffer.alloc(0);
    this.isHeader = isHeader;
    this.init();
  }
  init() {
    this.on("data", (chunk: Buffer) => {
      this.buffer = Buffer.concat([this.buffer, chunk]);
    });
    this.on("end", () => {
      if (this.isHeader) {
        this.buffer = this.buffer.slice(0, -7);
      }
      this.text = this.buffer.toString();
      // console.log(this.text);
    });
  }
}

export default Parser;