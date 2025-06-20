import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      js,
    },
    rules: {
      // JS-specific rule overrides (if any)
    },
    extends: ["js/recommended"],
  },

  // TypeScript base config
  {
    ...tseslint.configs.recommended,
    rules: {
      ...tseslint.configs.recommended.rules,
      // TypeScript-specific overrides
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },

  // React config with custom rule overrides
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed in React 17+
      "react/prop-types": "off", // If you're using TypeScript
    },
  },
]);
