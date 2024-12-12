module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!d3|internmap|delaunator|robust-predicates)",
  ],
  moduleDirectories: ["node_modules", "app/javascript"],
  testEnvironment: "jest-environment-jsdom",
  modulePathIgnorePatterns: ["<rootDir>/vendor"],
};
