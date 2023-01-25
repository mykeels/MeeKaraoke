import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import { assert } from "../../common";

import { getSongById } from "../../common/services";
import { SongPlayer } from "./SongPlayer";

type SongPlayerScreenProps = {
  className?: any;
  getSongById?: (id: string) => Promise<SongFileContent>;
};

export const SongPlayerScreen = ({ getSongById }: SongPlayerScreenProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: song } = useQuery(["songs", id], () =>
    assert(
      getSongById,
      "[getSongById] is required"
    )(assert(id, "[id] param is required"))
  );

  useEffect(() => {
    const onEscapeKeyPressed = (e: KeyboardEvent) => {
      e.key === "Escape" && navigate("/");
    };
    window.addEventListener("keypress", onEscapeKeyPressed);
    return () => {
      window.removeEventListener("keypress", onEscapeKeyPressed);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return song ? (
    <SongPlayer
      song={song}
      onPlayEnd={() => navigate("/")}
      width={window?.innerWidth}
      height={window?.innerHeight}
      isFullscreen
    />
  ) : null;
};

SongPlayerScreen.defaultProps = {
  getSongById,
};
