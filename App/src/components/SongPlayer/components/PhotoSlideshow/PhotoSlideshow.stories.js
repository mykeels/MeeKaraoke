import React from "react";
import { Player } from "@remotion/player";

import { PhotoSlideshow } from "./index";
import sampleSong from "./sample-song.json";
import { frames } from "../../../../common/utils";

export default {
  title: "components/SongPlayer/components/PhotoSlideshow",
  component: PhotoSlideshow,
  decorators: []
};

export const Index = () => (
  <Player
    component={() => (
      <PhotoSlideshow
        images={sampleSong.images}
        audioUrl="/sounds/something-just-like-this.mp3"
        lines={sampleSong.lines}
      ></PhotoSlideshow>
    )}
    durationInFrames={Math.ceil(frames(sampleSong.duration))}
    fps={frames(1)}
    compositionWidth={1280}
    compositionHeight={720}
    autoPlay
    loop
    controls
  />
);
