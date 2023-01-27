// Dependencies
import config from "../config.js";
import zlib from "zlib";
import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

const logLevelExtractorRegex = new RegExp(config.logLevelExtractor);

const getLogLevel = (message) => {
  const result = logLevelExtractorRegex.exec(message);

  if (!result || result.length === 0) {
    // if unable to extract, return the default log level
    return config.defaultLogLevel;
  }
  return result[1];
};

// Extract and unzip log data from event object
export function extract(event, callback) {
  const payload = Buffer.from(event.awslogs.data, "base64");

  zlib.gunzip(payload, function (err, result) {
    if (err) {
      console.error("Unable to unzip event payload");
      return callback(err);
    }
    callback(null, JSON.parse(result.toString("utf-8")));
  });
}

// Post logs using the given transport
export function post(meta, data, callback) {
  // Create a new Logger using the transport parameter
  const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);
  const logtailTransport = new LogtailTransport(logtail);
  const logger = winston.createLogger({ transports: [logtailTransport] });

  data.logEvents.forEach(function (logEvent) {
    const logLevel = getLogLevel(logEvent.message);
    logger.log(logLevel, { meta, log: logEvent.message }, function (error) {
      if (error) return callback(error);
      return callback();
    });
  });
}
