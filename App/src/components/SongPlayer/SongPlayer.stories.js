import React from "react";

import { SongPlayer } from "./";
import sampleSong from "../../common/data/sample-song.json";

export default {
  title: "components/SongPlayer",
  component: SongPlayer,
  decorators: []
};

export const Index = () => (
  <SongPlayer
    images={sampleSong.images}
    audioUrl="/sounds/something-just-like-this.mp3"
    lines={sampleSong.lines}
    width={640}
    height={320}
  />
);
