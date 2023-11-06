import classNames from "classnames";

export default function Skeleton() {
  return (
    <div className={classNames("h-[156px]", "animate-pulse")}>
      <div className="h-8 my-4 text-2xl bg-gray-300 w-2/12 rounded-sm"></div>
      <div className="h-5 my-2 text-lg bg-gray-300 w-3/5 rounded-sm"></div>
      <div className="h-5 my-2 text-lg bg-gray-300 w-4/5 rounded-sm"></div>
      <div className="h-5 my-2 bg-gray-300 w-1/5 rounded-sm"></div>
    </div>
  );
}
