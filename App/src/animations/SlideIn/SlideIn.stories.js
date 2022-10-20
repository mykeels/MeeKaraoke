import React from "react";
import { AbsoluteFill } from "remotion";
import { Player } from "@remotion/player";

import { SlideIn } from "./index";

export default {
  title: "animations/SlideIn",
  component: SlideIn,
  decorators: []
};

const fps = 60;
const durationInFrames = 3 * fps;

/**
 *
 * @type {React.FC<{ from: "top" | "bottom" | "left" | "right" }>}
 */
const SlideInComponent = ({ from }) => (
  <Player
    component={() => (
      <AbsoluteFill className="bg-pink items-center justify-center">
        <SlideIn duration={1} from={from}>
          <div className="bg-purple-200 p-8 rounded text-white text-xl">
            Hello World
          </div>
        </SlideIn>
      </AbsoluteFill>
    )}
    durationInFrames={durationInFrames}
    fps={fps}
    compositionWidth={640}
    compositionHeight={320}
    autoPlay
    loop
    controls
  />
);

export const FromBottom = () => <SlideInComponent from="bottom" />;

export const FromTop = () => <SlideInComponent from="top" />;

export const FromLeft = () => <SlideInComponent from="left" />;

export const FromRight = () => <SlideInComponent from="right" />;
