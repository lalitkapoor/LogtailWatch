// Dependencies
import AWS from "aws-sdk";
import { post } from "../lib/logger.js";

const apiGateway = new AWS.APIGateway({ apiVersion: "2015-07-09" });

let restApis = null;

export default function (data, callback) {
  if (restApis == null) {
    apiGateway.getRestApis({ limit: 500 }, function (err, apis) {
      if (err) {
        console.warn("Unable to retrieve Rest APIs");
        console.warn(err.code, "-", err.message);
      } else {
        // Construct RestAPI map using id as key, name as value
        if (apis.items) {
          restApis = apis.items.reduce(function (map, api) {
            map[api.id] = api.name.replace(" ", "_");
            return map;
          }, {});
        }
      }
      const meta = getMeta(data);
      post(meta, data, callback);
    });
  } else {
    const meta = getMeta(data);
    post(meta, data, callback);
  }
}

const getMeta = function (data) {
  console.log("api-gateway", data);
  // Construct the program name from the log group name
  let program = data.logGroup.split("_").splice(1).join("_").split("/");
  // If possible, replace the api ID with it's name
  if (restApis && restApis[program[0]]) program[0] = restApis[program[0]];
  program = program.join("_");

  return {
    type: "api-gateway",
    program: program,
  };
};
