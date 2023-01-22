import React from "react";

import { SongView } from "./";
import sampleSong from "../../common/data/sample-song.json";
import { BrowserRouter } from "react-router-dom";

export default {
  title: "components/SongView",
  component: SongView,
  decorators: []
};

export const Index = () => (
  <BrowserRouter>
    <SongView song={sampleSong} />
  </BrowserRouter>
);
