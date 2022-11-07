import React, { useState, useCallback, useEffect } from "react";
import { continueRender, delayRender } from "remotion";
import { PhotoSlideshow } from "../SongPlayer/components";

/**
 * @typedef {object} SongURLPlayerProps
 * @property {any} [className]
 * @property {string} url
 * @property {(duration: number) => any} onDurationChange
 */

/**
 * @type {React.FC<SongURLPlayerProps & { [key: string]: any }>}
 */
export const SongURLPlayer = ({ url, onDurationChange }) => {
  const [error, setError] = useState(null);
  /** @type {ReactState<SongFileContent>} */
  const [data, setData] = useState(null);
  const [handle] = useState(() => delayRender());
  const fetchData = useCallback(async () => {
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        onDurationChange(data?.duration);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });

    continueRender(handle);
  }, [handle]);
  useEffect(() => {
    fetchData();
  }, []);

  return error ? (
    <div>
      This component is supposed to be loaded when the server is running. It
      seems the server was not found, hence an error occurred while processing
      this component
    </div>
  ) : data ? (
    <PhotoSlideshow
      audioUrl={data.audioUrl}
      images={data.images}
      lines={data.lines}
    />
  ) : null;
};

SongURLPlayer.defaultProps = {
  onDurationChange: () => {},
  url: process.env.REACT_APP_VIDEO_URL || process.env.REMOTION_VIDEO_URL
};
