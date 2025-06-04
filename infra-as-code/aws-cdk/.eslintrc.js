/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/cdk.js"],
  parser: "@typescript-eslint/parser",
  ignorePatterns: [
    "cdk.out/",
  ],
  parserOptions: {
    project: true,
  },
  rules: {
    quotes: ["error", "single"],
  },
};