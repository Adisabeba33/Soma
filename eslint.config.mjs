// Flat ESLint config — a targeted baseline, not a kitchen-sink preset.
// Enables exactly the bug classes that have bitten (or nearly bitten) this
// repo: duplicate JSX attributes, unused imports/variables, missing hook
// dependencies, native-img misuse, and core accessibility mistakes. Keep
// the run clean; widen rules deliberately, not by preset.
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import next from "@next/eslint-plugin-next";

export default [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  {
    files: ["**/*.{ts,tsx,mjs}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      "@next/next": next,
    },
    settings: { react: { version: "detect" } },
    rules: {
      // Core correctness.
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-unreachable": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // React/JSX.
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-key": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // Next.js image guidance — the repo deliberately serves static
      // /public art with <img>, so warn rather than fail.
      "@next/next/no-img-element": "warn",
      // Accessibility floor.
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/no-noninteractive-tabindex": [
        "error",
        // SVG circles act as the Blender's slider knobs (role="slider").
        { roles: ["slider"] },
      ],
    },
  },
];
