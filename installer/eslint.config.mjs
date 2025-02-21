import tseslint from "typescript-eslint";

export default tseslint.config({
  files: ["**/*.ts"],
  extends: [tseslint.configs.strict, tseslint.configs.stylistic],
  rules: {
    "@typescript-eslint/no-require-imports": "off",
  },
});
