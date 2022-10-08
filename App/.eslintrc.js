module.exports = {
  parser: "@babel/eslint-parser",
  env: {
    es6: true,
    node: true,
    browser: true,
    "jest/globals": true
  },
  rules: {
    "no-console": "off",
    "simple-import-sort/sort": "error",
    "sort-imports": "off",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "react/prop-types": "off",
    "comma-dangle": "off"
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ["react", "simple-import-sort", "jest"],
  extends: ["eslint:recommended", "plugin:react/recommended"],
  globals: {
    it: true,
    describe: true,
    expect: true,
    test: true,
    beforeEach: true,
    beforeAll: true,
    afterEach: true,
    afterAll: true,
    _: true
  },
  overrides: [
    {
      files: "src/**/*.js",
      env: {
        node: true
      },
      rules: {
        "simple-import-sort/sort": "off",
        "react-hooks/exhaustive-deps": "off"
      }
    }
  ],
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    "scripts/",
    "typings/",
    "storybook-static/",
    ".eslintrc.js",
    "/*.js"
  ],
  settings: {
    react: {
      version: "detect"
    }
  }
};
