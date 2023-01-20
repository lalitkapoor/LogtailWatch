const logger = require("../lib/logger");

export default function (data, callback) {
  if (err) return callback(err);
  logger.post(null, data, callback);
}
