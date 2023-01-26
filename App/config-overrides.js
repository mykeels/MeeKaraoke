/* config-overrides.js */
const ModuleFederationPlugin = require("webpack").container
  .ModuleFederationPlugin;

const deps = require("./package.json").dependencies;

// eslint-disable-next-line
module.exports = function override(config, env) {
  config.output.publicPath = "auto";

  config.target = "web";
  config.entry = ["./src/index.tsx"];

  // config.plugins.push(
  //   new ModuleFederationPlugin({
  //     name: "MeeKaraoke",
  //     filename: "remoteEntry.js",
  //     exposes: {
  //       "./index.js": "./src/bootstrap.js"
  //     },
  //     shared: {
  //       react: {
  //         requiredVersion: deps["react"],
  //         import: "react",
  //         shareKey: "react",
  //         shareScope: "default",
  //         singleton: true
  //       },
  //       "react-dom": {
  //         requiredVersion: deps["react-dom"],
  //         singleton: true
  //       },
  //       "react-query": {
  //         requiredVersion: deps["react-query"],
  //         singleton: true
  //       }
  //     }
  //   })
  // );
  config.resolve.fallback = {
    https: false,
    http: false,
    zlib: false,
    fs: false
  }
  return config;
};
