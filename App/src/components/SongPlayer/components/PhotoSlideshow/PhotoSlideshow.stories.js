import React from "react";
import { Player } from "@remotion/player";

import { PhotoSlideshow } from "./index";
import sampleSong from "../../../../common/data/sample-song.json";
import { frames } from "../../../../common/utils";
import { SlidingSubtitles } from "../SlidingSubtitles";
import { HighlightedVerseSubtitles } from "../HighlightedVerseSubtitles";

export default {
  title: "components/SongPlayer/components/PhotoSlideshow",
  component: PhotoSlideshow,
  decorators: []
};

export const WithSlidingSubtitles = () => (
  <Player
    component={() => (
      <PhotoSlideshow
        images={sampleSong.images}
        audioUrl="./sounds/something-just-like-this.mp3"
        lines={sampleSong.lines}
        Subtitles={SlidingSubtitles}
      ></PhotoSlideshow>
    )}
    durationInFrames={Math.ceil(frames(sampleSong.duration))}
    fps={frames(1)}
    compositionWidth={640}
    compositionHeight={320}
    autoPlay={!process.env.REACT_APP_PREVENT_AUTOPLAY}
    loop
    controls
  />
);

export const WithHiglightedVerseSubtitles = () => (
  <Player
    component={() => (
      <PhotoSlideshow
        images={sampleSong.images}
        audioUrl="./sounds/something-just-like-this.mp3"
        lines={sampleSong.lines}
        Subtitles={HighlightedVerseSubtitles}
      ></PhotoSlideshow>
    )}
    durationInFrames={Math.ceil(frames(sampleSong.duration))}
    fps={frames(1)}
    compositionWidth={640}
    compositionHeight={320}
    autoPlay={!process.env.REACT_APP_PREVENT_AUTOPLAY}
    loop
    controls
  />
);
