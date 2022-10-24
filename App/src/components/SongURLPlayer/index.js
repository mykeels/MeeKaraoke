import React, { useState, useCallback, useEffect } from "react";
import { Composition, continueRender, delayRender } from "remotion";
import { frames } from "../../common";
import { SongPlayer } from "../SongPlayer";

/**
 * @typedef {object} SongURLPlayerProps
 * @property {any} [className]
 * @property {string} url
 */

/**
 * @type {React.FC<SongURLPlayerProps & { [key: string]: any }>}
 */
export const SongURLPlayer = ({ url }) => {
  /** @type {ReactState<SongFileContent>} */
  const [data, setData] = useState(null);
  const [handle] = useState(() => delayRender());
  const fetchData = useCallback(async () => {
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });

    continueRender(handle);
  }, [handle]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const duration = data
    ? data.song.reduce((sum, line) => sum + line.duration, 0)
    : 0;

  console.log({ url });

  return (
    <Composition
      id="SongURLPlayer"
      component={() =>
        data ? (
          <SongPlayer
            audioUrl={data.audioUrl}
            images={data.images}
            lines={data.song}
          ></SongPlayer>
        ) : null
      }
      durationInFrames={data ? Math.ceil(frames(duration)) : 720}
      fps={30}
      width={1280}
      height={720}
    />
  );
};

SongURLPlayer.defaultProps = {
  url: "http://localhost:5000/songs/3afbe273-71ec-49a6-92fc-742bd46d65ad"
};
