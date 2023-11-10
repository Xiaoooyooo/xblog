import HttpError from "http-errors";

export default function UnauthorizedError(message = "unauthorized") {
  return HttpError(401, message);
}
