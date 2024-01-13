import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { getScaleSize } from "./utils";

type ImageCropperProps = {
  file: File | Blob;
};

type ImageRect = {
  naturalHeight: number;
  naturalWidth: number;
  height: number;
  width: number;
};

type CropRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type Cropper = {
  crop: () => void;
};

export default forwardRef<Cropper, ImageCropperProps>(
  function ImageCropper(props, ref) {
    const { file } = props;
    const [imageUrl, setImageUrl] = useState<string>();
    const cropperElRef = useRef<HTMLDivElement>(null);
    const [imageRect, setImageRect] = useState<ImageRect>();
    const imageRectRef = useRef<typeof imageRect>();
    const [previewImageState, setPreviewImageState] = useState<CropRect>();
    const [cropArea, setCropArea] = useState<CropRect>({
      top: 0,
      left: 0,
      width: 150,
      height: 150,
    });
    const cropAreaRef = useRef<typeof cropArea>();

    useImperativeHandle(
      ref,
      () => {
        return {
          crop() {
            return new Promise<Blob | null>((resolve, reject) => {
              try {
                if (imageRect) {
                  const canvas = document.createElement("canvas");
                  const ctx = canvas.getContext(
                    "2d",
                  ) as CanvasRenderingContext2D;
                  const image = cropperElRef.current!.querySelector(
                    "#image",
                  ) as HTMLImageElement;
                  const { naturalWidth, width: WIDTH } = imageRect;
                  const size = 160;
                  const { top, left, height, width } = cropArea;
                  const scale = naturalWidth / WIDTH;
                  canvas.height = size;
                  canvas.width = size;
                  ctx.drawImage(
                    image,
                    left * scale,
                    top * scale,
                    width * scale,
                    height * scale,
                    0,
                    0,
                    size,
                    size,
                  );
                  canvas.toBlob((blob) => {
                    resolve(blob);
                  });
                }
              } catch (err) {
                reject(err);
              }
            });
          },
        };
      },
      [cropArea, imageRect],
    );

    useLayoutEffect(() => {
      cropAreaRef.current = cropArea;
    }, [cropArea]);

    useEffect(() => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      img.addEventListener("load", function () {
        const { naturalHeight, naturalWidth } = this;
        const cropSize = getScaleSize(naturalWidth, naturalHeight, 400);
        const rect = {
          naturalHeight,
          naturalWidth,
          ...cropSize,
        };
        setImageRect(rect);
        imageRectRef.current = rect;
        setImageUrl(url);
      });
    }, [file]);

    useEffect(() => {
      return () => {
        imageUrl && URL.revokeObjectURL(imageUrl);
      };
    }, [imageUrl]);

    useEffect(() => {
      if (imageRect) {
        const { left, top, height, width } = cropArea;
        const { height: HEIGHT, width: WIDTH } = imageRect;
        const scale = 128 / height;
        setPreviewImageState({
          height: HEIGHT * scale,
          width: WIDTH * scale,
          top: top * scale,
          left: left * scale,
        });
      }
    }, [cropArea, imageRect]);

    useEffect(() => {
      const cropperEl = cropperElRef.current!;
      const moveEl = cropperEl.querySelector("#cropper-move") as HTMLDivElement;
      const resizeTLEl = cropperEl.querySelector(
        "#resize-tl",
      ) as HTMLDivElement;
      const resizeTREl = cropperEl.querySelector(
        "#resize-tr",
      ) as HTMLDivElement;
      const resizeBREl = cropperEl.querySelector(
        "#resize-br",
      ) as HTMLDivElement;
      const resizeBLEl = cropperEl.querySelector(
        "#resize-bl",
      ) as HTMLDivElement;
      let isResizeTL = false;
      let isResizeTR = false;
      let isResizeBR = false;
      let isResizeBL = false;
      let containerRect: typeof imageRect;
      let prevPosition: { x: number; y: number };
      const minEdge = 20;
      function onMousedown(e: MouseEvent) {
        console.log("mousedown");
        const { clientX, clientY } = e;
        containerRect = imageRectRef.current!;
        prevPosition = { x: clientX, y: clientY };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      }
      function onMouseMove(e: MouseEvent) {
        const { clientX, clientY } = e;
        const { x, y } = prevPosition;
        const dx = clientX - x,
          dy = clientY - y;
        const { height: HEIGHT, width: WIDTH } = containerRect!;
        prevPosition = { x: clientX, y: clientY };
        setCropArea((p) => {
          const { top: t, left: l, height: h, width: w } = p;
          if (isResizeTL) {
            const top = t + dx;
            const left = l + dx;
            let offset: number;
            if (top >= 0 && left >= 0) {
              offset = w - dx >= minEdge ? dx : w - minEdge;
            } else if (top >= 0) {
              offset = -l;
            } else if (left >= 0) {
              offset = -t;
            } else {
              offset = Math.max(-t, -l);
            }
            return {
              top: t + offset,
              left: l + offset,
              width: w - offset,
              height: h - offset,
            };
          } else if (isResizeTR) {
            const top = t - dx;
            const right = l + w + dx;
            let offset: number;
            if (top >= 0 && right <= WIDTH) {
              offset = w + dx >= minEdge ? dx : w - minEdge;
            } else if (right > WIDTH) {
              offset = WIDTH - l - w;
            } else if (top < 0) {
              offset = t;
            } else {
              offset = Math.min(t, WIDTH - right);
            }
            return {
              ...p,
              top: t - offset,
              height: h + offset,
              width: w + offset,
            };
          } else if (isResizeBR) {
            const bottom = t + h + dx;
            const right = l + w + dx;
            let edge: number;
            if (bottom <= HEIGHT && right <= WIDTH) {
              edge = w + dx >= minEdge ? w + dx : minEdge;
            } else if (right > WIDTH) {
              edge = WIDTH - l;
            } else if (bottom > HEIGHT) {
              edge = HEIGHT - t;
            } else {
              edge = Math.min(HEIGHT - h, WIDTH - l);
            }
            return { ...p, width: edge, height: edge };
          } else if (isResizeBL) {
            const left = l + dx;
            const bottom = t + h - dx;
            let offset: number;
            if (left >= 0 && bottom <= HEIGHT) {
              offset = w - dx >= minEdge ? dx : w - minEdge;
            } else if (left < 0) {
              offset = -l;
            } else if (bottom > HEIGHT) {
              offset = HEIGHT - t - h;
            } else {
              offset = Math.max(-l, HEIGHT - t + h);
            }
            return {
              ...p,
              left: l + offset,
              height: h - offset,
              width: w - offset,
            };
          } else {
            const _top = t + dy;
            const _left = l + dx;
            const top = _top < 0 ? 0 : _top + h > HEIGHT ? HEIGHT - h : _top;
            const left = _left < 0 ? 0 : _left + w > WIDTH ? WIDTH - w : _left;
            return { ...p, top, left };
          }
        });
      }
      function onMouseUp(e: MouseEvent) {
        console.log("mouseup");
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        isResizeTL = false;
        isResizeTR = false;
        isResizeBR = false;
        isResizeBL = false;
      }
      function onResizeTLMousedown(e: MouseEvent) {
        isResizeTL = true;
        onMousedown(e);
      }
      function onResizeTRMousedown(e: MouseEvent) {
        isResizeTR = true;
        onMousedown(e);
      }
      function onResizeBRMousedown(e: MouseEvent) {
        isResizeBR = true;
        onMousedown(e);
      }
      function onResizeBLMousedown(e: MouseEvent) {
        isResizeBL = true;
        onMousedown(e);
      }
      moveEl.addEventListener("mousedown", onMousedown);
      resizeTLEl.addEventListener("mousedown", onResizeTLMousedown);
      resizeTREl.addEventListener("mousedown", onResizeTRMousedown);
      resizeBREl.addEventListener("mousedown", onResizeBRMousedown);
      resizeBLEl.addEventListener("mousedown", onResizeBLMousedown);
      return () => {
        moveEl.removeEventListener("mousedown", onMousedown);
        resizeTLEl.removeEventListener("mousedown", onResizeTLMousedown);
        resizeTREl.removeEventListener("mousedown", onResizeTRMousedown);
        resizeBREl.removeEventListener("mousedown", onResizeBRMousedown);
        resizeBLEl.removeEventListener("mousedown", onResizeBLMousedown);
      };
    }, []);

    return (
      <div className="flex items-center gap-x-4 select-none" ref={cropperElRef}>
        <div className="relative">
          <img
            id="image"
            src={imageUrl}
            className="block"
            style={{
              height: imageRect?.height,
              width: imageRect?.width,
            }}
          />
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]"></div>
          <div
            className="absolute inset-0 overflow-hidden cursor-move"
            style={{
              width: cropArea.width,
              height: cropArea.height,
              transform: `translate(${cropArea.left}px, ${cropArea.top}px)`,
            }}
          >
            <img
              src={imageUrl}
              className="block max-w-none"
              style={{
                height: imageRect?.height,
                width: imageRect?.width,
                transform: `translate(${-cropArea.left}px, ${-cropArea.top}px)`,
              }}
            />
            <div id="cropper-move" className="absolute inset-0"></div>
            <div
              id="resize-tl"
              className="absolute h-2 w-2 bg-white top-0 left-0 cursor-nwse-resize"
            ></div>
            <div
              id="resize-tr"
              className="absolute h-2 w-2 bg-white top-0 right-0 cursor-nesw-resize"
            ></div>
            <div
              id="resize-br"
              className="absolute h-2 w-2 bg-white bottom-0 right-0 cursor-nwse-resize"
            ></div>
            <div
              id="resize-bl"
              className="absolute h-2 w-2 bg-white bottom-0 left-0 cursor-nesw-resize"
            ></div>
          </div>
        </div>
        <div className="h-32 w-32 rounded-full relative overflow-hidden">
          {imageUrl && (
            <img
              src={imageUrl}
              className="block absolute max-w-none"
              style={{
                height: previewImageState?.height,
                width: previewImageState?.width,
                top: previewImageState && -previewImageState.top,
                left: previewImageState && -previewImageState.left,
              }}
            />
          )}
        </div>
      </div>
    );
  },
);
