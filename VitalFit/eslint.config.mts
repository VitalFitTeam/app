// eslint.config.mts
import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import react from "eslint-plugin-react"
import { defineConfig } from "eslint/config"

export default defineConfig([
  // Base JS
  js.configs.recommended,

  // TS
  ...tseslint.configs.recommended,

  // React
  react.configs.flat.recommended,

  // ✅ Settings GLOBAL para que no salga el warning
  {
    settings: { react: { version: "detect" } },
  },

  // TS/TSX: exige import (no require)
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-require-imports": "error",
    },
  },

  // JS/JSX de Node, Metro, scripts: permitir require
  {
    files: [
      "**/*.{js,jsx}",
      "metro.config.js",
      "scripts/**/*.js",
    ],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },

  // Ignorados
  {
    ignores: ["node_modules", "dist", "build", ".expo", ".prettierrc.js"],
  },
])
