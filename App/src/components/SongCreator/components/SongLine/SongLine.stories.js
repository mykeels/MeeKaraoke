import React from "react";

import { SongLine } from "./";

export default {
  title: "components/SongCreator/components/SongLine",
  component: SongLine,
  decorators: []
};

export const Index = () => (
  <SongLine
    cursor={1}
    line={{
      duration: 1,
      from: 0,
      text: "Hello World"
    }}
  />
);

export const Inactive = () => (
  <SongLine
    cursor={5}
    line={{
      duration: 1,
      from: 0,
      text: "Hello World"
    }}
  />
);
