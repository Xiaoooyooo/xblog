import HttpError from "http-errors";

export default function BadRequestError(message = "Wrong request paramaters") {
  return HttpError(400, message);
}
