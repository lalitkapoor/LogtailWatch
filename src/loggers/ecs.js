const logger = require("../lib/logger");

// Handler function
export default function (data, callback) {
  const meta = {
    type: "ecs",
    hostname: "ECS_" + data.owner + "_" + process.env.AWS_REGION,
    program: data.logGroup.split("/").pop(),
  };

  logger.post(meta, data, callback);
}
