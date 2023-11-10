import HttpError from "http-errors";

export default function NotFoundError(
  message = "The resource you are looking for is not exists",
) {
  return HttpError(404, message);
}
