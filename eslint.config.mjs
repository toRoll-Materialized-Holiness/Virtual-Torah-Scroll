// @ts-check

import eslint from "@eslint/js"
import tseslint from "typescript-eslint"

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        document: "readonly",
        window: "readonly",
        console: "readable",
      },
    },
  },
  {
    ignores: ["js/CETEI.js", "dist/**/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  // Node.js override
  {
    files: ["tools/*.mjs"], // or just a specific file: ["scripts/build.js"]
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module", // or "commonjs" if you're using require()
      globals: {
        process: "readonly",
        require: "readonly",
        module: "readonly",
        console: "readonly",
        global: "readonly",
      },
    },
  },
)
