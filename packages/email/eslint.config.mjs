import createConfig from "@fulleststack/eslint-config/create-config";

export default createConfig({
  react: true,
}, {
  rules: {
    "unicorn/filename-case": "off",
    "react-refresh/only-export-components": "off",
  },
});
