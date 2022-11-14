import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

import { getSongById } from "../../common/services";
import { LyricsTabView } from "./components/LyricsTabView";
import { SongCreator } from "./SongCreator";

/**
 * @typedef {object} SongCreatorScreenProps
 * @property {any} [className]
 * @property {React.FC<import("./SongCreator").SongCreatorProps>} [SongCreator]
 * @property {(id: string) => Promise<SongFileContent>} [getSongById]
 */

/**
 * @type {React.FC<SongCreatorScreenProps & { [key: string]: any }>}
 */
export const SongCreatorScreen = ({ SongCreator, getSongById }) => {
  const { id } = useParams();
  const { data: song } = useQuery(["songs", id], () => getSongById(id));
  return song ? (
    <SongCreator
      url={song.audioUrl}
      title={song.title}
      defaults={{
        lines: song?.lines,
        images: song?.images
      }}
      LyricsTabView={(props) => (
        <LyricsTabView
          {...props}
          title={song?.title}
          defaults={{
            active: "pretty",
            text: song?.lyrics
          }}
        />
      )}
    />
  ) : null;
};

SongCreatorScreen.defaultProps = {
  SongCreator,
  getSongById
};
