export default {
  logLevelExtractor:
    ".* - (error|warn|info|verbose|debug|trace|emerg|alert|crit|notice|silly): ",

  // pino logger's default log levels
  logLevelKey: "level",
  logLevels: { trace: 10, debug: 20, info: 30, warn: 40, error: 50, fatal: 60 },

  defaultLogLevel: "info",
};
