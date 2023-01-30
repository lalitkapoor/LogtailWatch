// Dependencies
import config from "../config.js";
import zlib from "zlib";
import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

const logLevelExtractorRegex = new RegExp(config.logLevelExtractor);

const getLogLevelFromJSON = (message) => {
  const level = message[config.logLevelKey];
  if (level == null) return null;

  const levelName = Object.keys(config.logLevels).find(
    (key) => config.logLevels[key] === level
  );
  return levelName;
};

const getLogLevelFromString = (message) => {
  const level = logLevelExtractorRegex.exec(message);
  if (!level || level.length === 0) {
    // if unable to extract, return the default log level
    return config.defaultLogLevel;
  }
  return level[1];
};

const getLogLevel = (message) => {
  console.log("message", message);

  let level = null;
  // try getting level from json if json message
  try {
    level = getLogLevelFromJSON(JSON.parse(message));
  } catch (error) {}

  // resort to regex search for level name
  if (level == null) level = getLogLevelFromString(message);
  if (level == null) level = "info";

  console.log("level", level);
  return level;
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
  const logger = winston.createLogger({
    transports: [logtailTransport],
    levels: config.logLevels,
  });

  data.logEvents.forEach(function (logEvent) {
    const logLevel = getLogLevel(logEvent.message);
    console.log("submitting with level", logLevel);
    logger.log(logLevel, logEvent.message, { meta }, function (error) {
      if (error) return callback(error);
      return callback();
    });
  });
}
