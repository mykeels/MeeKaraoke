const { mergeConfig } = require("vite");
const dotenv = require("dotenv");

const { parsed } = dotenv.config();

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    builder: "@storybook/builder-vite"
  },
};
