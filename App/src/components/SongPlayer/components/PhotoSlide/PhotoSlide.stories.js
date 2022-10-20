import React from "react";
import { Player } from "@remotion/player";

import { PhotoSlide } from "./";

export default {
  title: "components/PhotoSlide",
  component: PhotoSlide,
  decorators: []
};

const fps = 30;
const durationInFrames = 3 * fps;

export const Index = () => (
  <Player
    component={() => <PhotoSlide imageURL={image}>Hello World</PhotoSlide>}
    durationInFrames={durationInFrames}
    fps={fps}
    compositionWidth={1280}
    compositionHeight={720}
    autoPlay
    loop
  />
);

var image =
  "https://images.unsplash.com/photo-1474692295473-66ba4d54e0d3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1084&q=80";
