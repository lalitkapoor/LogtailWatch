import { post } from "../lib/logger.js";

export default function (data, callback) {
  if (err) return callback(err);
  const meta = {
    type: "generic",
    program: data.logGroup,
  };
  post(meta, data, callback);
}
