import baseConfig from "../../eslint.config.js";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(...baseConfig, {
  plugins: {
    import: importPlugin,
  },
  languageOptions: {
    ecmaVersion: 2022,
    globals: {
      ...globals.node,
    },
  },
  rules: { "import/extensions": ["error", "always"] },
});
