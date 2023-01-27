import { post } from "../lib/logger.js";

export default function (data, callback) {
  const meta = {
    type: "lambda",
    hostname: "Lambda_" + data.owner + "_" + process.env.AWS_REGION,
    program: data.logGroup.split("/").pop(),
  };
  post(meta, data, callback);
}
