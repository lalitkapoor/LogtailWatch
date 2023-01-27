import { extract } from "./lib/logger.js";
import lambda from "./loggers/lambda.js";
import apiGateway from "./loggers/apiGateway.js";
import ecs from "./loggers/ecs.js";
import generic from "./loggers/generic.js";

export function handler(event, context, callback) {
  extract(event, function (err, data) {
    if (err) return callback(err);

    const logGroup = data.logGroup;
    if (logGroup.startsWith("/ecs/")) return ecs(data, callback);
    if (logGroup.startsWith("/aws/lambda/")) return lambda(data, callback);
    if (logGroup.startsWith("API-Gateway-Execution-Logs_"))
      return apiGateway(data, callback);
    return generic(data, callback);
  });
}
