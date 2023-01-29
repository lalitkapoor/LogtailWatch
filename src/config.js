export default {
  logLevelExtractor:
    ".* - (error|warn|info|verbose|debug|emerg|alert|crit|notice|silly): ",
  pinoLevels: {
    names: ["trace", "debug", "info", "warn", "error", "fatal"],
    values: [10, 20, 30, 40, 50, 60],
  },
  defaultLogLevel: "info",
};
