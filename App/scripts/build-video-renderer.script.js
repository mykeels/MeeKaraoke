/**
 * The built renderer module is used by the renderMedia() function
 * https://www.remotion.dev/docs/renderer/render-media
 */

const path = require("path");
const { bundle } = require("@remotion/bundler");
const { webpackOverride } = require("../src/webpack-override");

(async () => {
  let progress = 0;
  await bundle({
    entryPoint: path.join(__dirname, "../src/components/SongComposition/index.tsx"),
    onProgress: p => {
      if (p > progress) {
        progress = p;
        console.log(`progress: ${progress}%`);
      }
    },
    outDir: path.join(__dirname, "../build/renderer"),
    enableCaching: true,
    webpackOverride
  });
})();
