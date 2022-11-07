import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App";
import { SongPicker } from "./components";
import sampleSong from "./common/data/sample-song.json";

export default {
  title: "App",
  component: App,
  decorators: []
};

const queryClient = new QueryClient();

export const Index = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter basename="/iframe.html">
      <App
        getSongById={async (id) => ({
          id,
          ...(records.find(r => r.id === id)),
          audioUrl: "/sounds/something-just-like-this.mp3",
          lyrics: sampleSong.lines
            .reduce((arr, line) => arr.concat(line.text), [])
            .join("\n"),
          song: sampleSong.lines,
          ...sampleSong
        })}
        SongPicker={(props) => (
          <SongPicker {...props} getSongRecords={async () => records} />
        )}
      />
    </BrowserRouter>
  </QueryClientProvider>
);

var records = [
  {
    id: "1",
    title: "Something just like this - The Chainsmokers & Coldplay",
    updatedAt: "2016-05-25T01:00:00.123"
  }
];
