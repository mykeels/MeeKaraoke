import React from "react";
import { Player } from "@remotion/player";
import { PhotoSlideshow } from "./components";
import { frames } from "../../common/utils";

/**
 * @typedef {object} SongPlayerProps
 * @property {LyricLine[]} lines
 * @property {string} audioUrl
 * @property {string[]} images
 * @property {number} width
 * @property {number} height
 */

/**
 * @type {React.FC<SongPlayerProps & { [key: string]: any }>}
 */
export const SongPlayer = ({ lines, audioUrl, images, width, height }) => {
  const duration = lines.reduce((sum, line) => sum + line.duration, 0);
  return (
    <div className="block h-screen w-screen px-16 py-8">
      <Player
        component={() => (
          <PhotoSlideshow audioUrl={audioUrl} images={images} lines={lines} />
        )}
        durationInFrames={frames(duration)}
        compositionWidth={width}
        compositionHeight={height}
        fps={frames(1)}
        controls
        autoPlay={!process.env.REACT_APP_PREVENT_AUTOPLAY}
      />
    </div>
  );
};

SongPlayer.defaultProps = {
  width: 1280,
  height: 720
};
