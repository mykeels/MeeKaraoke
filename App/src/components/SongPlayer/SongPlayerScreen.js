import React from "react";
import { useQuery } from "react-query";
import { useParams, useNavigate } from "react-router-dom";

import { getSongById } from "../../common/services";
import { SongPlayer } from "./SongPlayer";

/**
 * @typedef {object} SongPlayerScreenProps
 * @property {any} [className]
 * @property {(id: string) => Promise<SongFileContent>} [getSongById]
 */

/**
 * @type {React.FC<SongPlayerScreenProps & { [key: string]: any }>}
 */
export const SongPlayerScreen = ({ getSongById }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: song } = useQuery(["songs", id], () => getSongById(id));

  return song ? (
    <SongPlayer
      audioUrl={song?.audioUrl}
      images={song?.images}
      lines={song?.lines}
      onPlayEnd={() => navigate("/")}
      isFullscreen
    />
  ) : null;
};

SongPlayerScreen.defaultProps = {
  getSongById
};
