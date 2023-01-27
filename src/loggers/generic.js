import { post } from "../lib/logger.js";

export default function (data, callback) {
  if (err) return callback(err);
  post(null, data, callback);
}
