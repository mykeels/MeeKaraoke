import initStoryshots from "@storybook/addon-storyshots";
import { Settings } from "luxon";
import timemachine from "timemachine";

import { sleep } from "./common";

beforeEach(() => {
  window.matchMedia = () => ({
    matches: true,
    addListener: () => {},
    removeListener: () => {}
  });
});

beforeAll(() => {
  timemachine.config({
    dateString: "2020-08-08T04:00:00.000Z"
  });
  Settings.defaultLocale = "en";
  Settings.defaultZoneName = "utc";
});

afterAll(() => {
  jest.clearAllMocks();
  timemachine.reset();
});

initStoryshots({
  suite: "@mykeels/sticky-notes",
  test: multiSnapshotWithOptions({}),
  storyKindRegex: /^((?!.*?App).)*$/
});

const isFunction = obj => !!(obj && obj.constructor && obj.call && obj.apply);
const optionsOrCallOptions = (opts, story) =>
  isFunction(opts) ? opts(story) : opts;

function snapshotWithOptions(options = {}) {
  return ({ story, context, renderTree, snapshotFileName }) => {
    const result = renderTree(
      story,
      context,
      optionsOrCallOptions(options, story)
    );

    async function match(tree) {
      let target = tree;
      const isReact = story.parameters.framework === "react";

      await sleep(400);

      if (isReact && typeof tree.childAt === "function") {
        target = tree.childAt(0);
      }
      if (isReact && Array.isArray(tree.children)) {
        [target] = tree.children;
      }

      if (snapshotFileName) {
        expect(target).toMatchSpecificSnapshot(snapshotFileName);
      } else {
        expect(target).toMatchSnapshot();
      }

      if (typeof tree.unmount === "function") {
        tree.unmount();
      }
    }

    if (typeof result.then === "function") {
      return result.then(match).catch(() => match(result));
    }

    return match(result);
  };
}

function multiSnapshotWithOptions(options = {}) {
  return ({ story, context, renderTree, stories2snapsConverter }) => {
    const snapshotFileName = stories2snapsConverter.getSnapshotFileName(
      context
    );
    return snapshotWithOptions(options)({
      story,
      context,
      renderTree,
      snapshotFileName: snapshotFileName.replace(/^src(\\|\/)/, "")
    });
  };
}
