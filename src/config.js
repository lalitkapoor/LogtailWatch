export default {
  // pino logger's default log levels
  logLevelExtractor: ".* - (trace|debug|info|warn|error|fatal): ",
  logLevelKey: "level",
  logLevels: { trace: 10, debug: 20, info: 30, warn: 40, error: 50, fatal: 60 },
  defaultLogLevel: "info",
};
