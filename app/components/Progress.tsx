import { useState, useEffect } from "react";

export default function Progress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((progress) => progress + (100 - progress) * 0.2);
    }, 500);
    return () => clearInterval(timer);
  }, []);
  return (
    <div
      style={{ width: progress + "%" }}
      className="fixed top-0 h-1 bg-blue-500 transition-[width] duration-300"
    ></div>
  );
}
