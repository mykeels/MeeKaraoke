import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { SongPicker } from "./";

export default {
  title: "components/SongPicker",
  component: SongPicker,
  decorators: []
};

const queryClient = new QueryClient();

export const Index = () => (
  <QueryClientProvider client={queryClient}>
    <SongPicker
      getSongRecords={async () => records}
      deleteSong={async () => {}}
      onNewSong={() => {}}
      onSelectSong={console.log}
    />
  </QueryClientProvider>
);

export const Only3Records = () => (
  <QueryClientProvider client={queryClient}>
    <SongPicker
      getSongRecords={async () => records.slice(0, 2)}
      deleteSong={async () => {}}
      onNewSong={() => {}}
      onSelectSong={console.log}
    />
  </QueryClientProvider>
);

var records = [
  {
    id: "1",
    title: "Hello World",
    updatedAt: "2016-05-25T01:00:00.123"
  },
  {
    id: "2",
    title: "Hello World",
    updatedAt: "2016-05-25T01:00:00.123"
  },
  {
    id: "3",
    title: "Hello World",
    updatedAt: "2016-05-25T01:00:00.123"
  },
  {
    id: "4",
    title: "Hello World",
    updatedAt: "2016-05-25T01:00:00.123"
  },
  {
    id: "5",
    title: "Hello World",
    updatedAt: "2016-05-25T01:00:00.123"
  },
  {
    id: "6",
    title: "Hello World",
    updatedAt: "2016-05-25T01:00:00.123"
  },
  {
    id: "7",
    title: "Hello World",
    updatedAt: "2016-05-25T01:00:00.123"
  },
  {
    id: "8",
    title: "Hello World",
    updatedAt: "2016-05-25T01:00:00.123"
  }
];
