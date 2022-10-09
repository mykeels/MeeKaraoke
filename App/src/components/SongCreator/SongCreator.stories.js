import React from "react";

import { SongCreator } from "./";

export default {
  title: "components/SongCreator",
  component: SongCreator
};

export const Index = () => <SongCreator text={somethingJustLikeThisLyrics} />;

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
