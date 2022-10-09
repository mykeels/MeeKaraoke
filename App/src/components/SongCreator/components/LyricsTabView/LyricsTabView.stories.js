import React, { useState } from "react";

import { LyricsTabView } from "./";

export default {
  title: "components/SongCreator/components/LyricsTabView",
  component: LyricsTabView,
  decorators: []
};

export const Index = () => {
  const [song, setSong] = useState([]);

  return (
    <LyricsTabView
      defaults={{ text: somethingJustLikeThisLyrics }}
      song={song}
      onSongChanged={setSong}
    />
  );
};

export const Cursor5 = () => {
  const [song, setSong] = useState([]);

  return (
    <LyricsTabView
      defaults={{ text: somethingJustLikeThisLyrics, active: "pretty" }}
      song={song}
      onSongChanged={setSong}
      cursor={5}
    />
  );
};

var somethingJustLikeThisLyrics = `I've been reading books of old
The legends and the myths
Achilles and his gold

But she said, where d'you wanna go?
How much you wanna risk?
I'm not looking for somebody
With some superhuman gifts
With some superhuman gifts
Some superhero
Some fairytale bliss
Just something I can turn to
Somebody I can miss`;
