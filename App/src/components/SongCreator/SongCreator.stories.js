import React from "react";

import { SongCreator } from "./";
import { LyricsTabView } from "./components/LyricsTabView";
import sampleSong from "../../common/data/sample-song.json";

export default {
  title: "components/SongCreator",
  component: SongCreator
};

export const NoDurations = () => (
  <SongCreator
    url={"./sounds/something-just-like-this.mp3"}
    LyricsTabView={(props) => (
      <LyricsTabView
        {...props}
        defaults={{
          text: sampleSong.lines.map((line) => line.text).join("\n"),
          active: "pretty"
        }}
      />
    )}
  />
);

export const WithDurations = () => (
  <SongCreator
    url={"./sounds/something-just-like-this.mp3"}
    defaults={{
      song: sampleSong.lines,
      images: sampleSong.images
    }}
    LyricsTabView={(props) => (
      <LyricsTabView
        {...props}
        song={sampleSong.lines}
        defaults={{
          text: sampleSong.lines.map((line) => line.text).join("\n"),
          active: "pretty"
        }}
      />
    )}
  />
);
