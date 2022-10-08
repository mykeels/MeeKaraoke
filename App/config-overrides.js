/* config-overrides.js */
const ModuleFederationPlugin = require("webpack").container
  .ModuleFederationPlugin;
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const deps = require("./package.json").dependencies;

// eslint-disable-next-line
module.exports = function override(config, env) {
  config.output.publicPath = "auto";

  config.target = "web";
  config.entry = ["./src/index.js"];

  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      generateStatsFile: true,
      openAnalyzer: false
    })
  );
  config.plugins.push(
    new ModuleFederationPlugin({
      name: "CustomerSettings",
      filename: "remoteEntry.js",
      exposes: {
        "./index.js": "./src/bootstrap.js"
      },
      shared: {
        react: {
          requiredVersion: deps["react"],
          import: "react",
          shareKey: "react",
          shareScope: "default",
          singleton: true
        },
        "react-dom": {
          requiredVersion: deps["react-dom"],
          singleton: true
        },
        "react-query": {
          requiredVersion: deps["react-query"],
          singleton: true
        },
        ...(process.env.WEBPACK_NODE_ENV === "production"
          ? {}
          : {
              "@enpowered/ui": {
                singleton: true
              },
              "@enpowered/ui/dist/index.css": {
                singleton: true
              }
            }),
        "@enpowered/microfrontends": {
          singleton: true
        }
      }
    })
  );
  config.resolve = {
    fallback: {
      https: false,
      http: false,
      zlib: false,
      fs: false
    }
  };
  return config;
};
