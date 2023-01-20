// Dependencies
const AWS = require("aws-sdk");
const cloudwatch = new AWS.CloudWatchLogs({ apiVersion: "2014-03-28" });
const config = require("../config/logtailwatch.json");

// Handler function
exports.handler = function (event, context, callback) {
  const logGroup = event.detail.requestParameters.logGroupName;
  let consumer;

  // Check configured sources for a matching prefix
  config.sources.some(function (source) {
    if (logGroup.startsWith(source.prefix)) {
      consumer = source.consumer;
      return true;
    }
  });

  if (!consumer) {
    // Invalid log source
    console.info("Invalid log group source, no action taken");
    return callback();
  } else if (
    config.sources.some(function (source) {
      return "/aws/lambda/" + source.consumer == logGroup;
    })
  ) {
    // Don't subscribe a consumer function to a consumer log group
    console.info("Log group is for a consumer function, no action taken");
    return callback();
  } else if (config.exclude && config.exclude.indexOf(logGroup) > -1) {
    //Check if the log group is on the exclusion list
    console.log("Log group excluded, no action taken");
    return callback();
  }

  // Construct consumer function arn
  const consumerArn =
    "arn:aws:lambda:" +
    event.region +
    ":" +
    event.account +
    ":function:" +
    consumer;

  const subscriptionParams = {
    logGroupName: logGroup,
    destinationArn: consumerArn,
    filterName: "logtail",
    filterPattern: "",
  };

  // Subscribe consumer to log group
  cloudwatch.putSubscriptionFilter(subscriptionParams, function (err, data) {
    if (err) {
      console.error(
        "Unable to create subscription filter for log group ",
        logGroup
      );
      console.error(err.code, "-", err.message);
    }

    // Execute callback here, since we don't care if the putRetentionPolicy request fails or not
    return callback(err);
  });

  if (config.retentionPeriod) {
    const retentionParams = {
      logGroupName: logGroup,
      retentionInDays: config.retentionPeriod,
    };

    // Set log group's retention policy to 3 days
    cloudwatch.putRetentionPolicy(retentionParams, function (err, data) {
      if (err) {
        console.warn("Unable to update log group retention policy");
        console.warn(err.code, "-", err.message);
      }
    });
  }
};
