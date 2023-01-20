const logger = require("../lib/logger");

export default function (data, callback) {
  const meta = {
    type: "lambda",
    hostname: "Lambda_" + data.owner + "_" + process.env.AWS_REGION,
    program: data.logGroup.split("/").pop(),
  };
  logger.post(meta, data, callback);
}
