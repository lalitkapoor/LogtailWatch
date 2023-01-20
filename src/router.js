const logger = require("./lib/logger");
const lambda = require("./loggers/lambda");
const apiGateway = require("./loggers/apiGateway");
const ecs = require("./loggers/ecs");
const generic = require("./loggers/generic");

exports.handler = function (event, context, callback) {
  logger.extract(event, function (err, data) {
    if (err) return callback(err);

    const logGroup = data.logGroup;
    if (logGroup.startsWith("/ecs/")) return ecs(data, callback);
    if (logGroup.startsWith("/aws/lambda/")) return lambda(data, callback);
    if (logGroup.startsWith("API-Gateway-Execution-Logs_"))
      return apiGateway(data, callback);
    return generic(data, callback);
  });
};
