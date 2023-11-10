import HttpError from "http-errors";

export default function ForbiddenError(
  message = "The operation you are currently performing is not allowed",
) {
  return HttpError(403, message);
}
