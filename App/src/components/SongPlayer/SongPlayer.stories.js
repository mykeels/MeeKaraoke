import React from "react";

import { SongPlayer } from "./";
import sampleSong from "../../common/data/sample-song.json";
import { SlidingSubtitles } from "./components/SlidingSubtitles";
import { HighlightedVerseSubtitles } from "./components/HighlightedVerseSubtitles";
import { AbsoluteFill } from "remotion";
import classNames from "classnames";

export default {
  title: "components/SongPlayer",
  component: SongPlayer,
  decorators: []
};

export const WithSlidingSubtitles = () => (
  <SongPlayer
    images={sampleSong.images}
    audioUrl="./sounds/something-just-like-this.mp3"
    lines={sampleSong.lines}
    width={640}
    height={320}
    Subtitles={SlidingSubtitles}
  />
);

export const WithHighlightedVerseSubtitles = () => (
  <SongPlayer
    images={sampleSong.images}
    audioUrl="./sounds/something-just-like-this.mp3"
    lines={sampleSong.lines}
    width={640}
    height={320}
    Subtitles={HighlightedVerseSubtitles}
  />
);

export const WithSolidBackground = () => (
  <SongPlayer
    images={sampleSong.images}
    audioUrl="./sounds/something-just-like-this.mp3"
    lines={sampleSong.lines}
    width={640}
    height={320}
    Subtitles={HighlightedVerseSubtitles}
    Background={() => (
      <AbsoluteFill
        className={classNames("bg-black items-center justify-center")}
      ></AbsoluteFill>
    )}
  />
);
