import createConfig from "@fulleststack/eslint-config/create-config";

export default createConfig({
  react: true,
}, {
  rules: {
    "ts/no-require-imports": "off",
    "unicorn/filename-case": "off",
    "ts/no-use-before-define": "off",
    "node/no-process-env": "off",
  },
});
