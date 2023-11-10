import HttpError from "http-errors";

export default function InternalServerError(message = "Internal Server Error") {
  return HttpError(500, message);
}
