import { updateBlogViews } from "@/services/functions/blog";
import { useEffect, useRef } from "react";

type ViewUpdaterProps = {
  blogId: string;
  onUpdated: (views: number) => void;
};

export default function ViewUpdater(props: ViewUpdaterProps) {
  const { blogId, onUpdated } = props;
  const elRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let observer: IntersectionObserver | null;
    if (elRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            updateBlogViews(blogId).then((views) => {
              onUpdated(views);
            });
            observer!.disconnect();
            observer = null;
          }
        },
        { rootMargin: "50px" },
      );
      observer.observe(elRef.current);
    }
    return () => {
      observer?.disconnect();
    };
  }, [blogId, onUpdated]);
  return <div ref={elRef}></div>;
}
