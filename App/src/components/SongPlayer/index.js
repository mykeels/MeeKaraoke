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
 * @type {React.FC<SongPlayerProps & { [key: string]: any } & React.RefAttributes<import("@remotion/player").PlayerRef>>}
 */
export const SongPlayer = React.forwardRef(function SongPlayer(
  { lines, audioUrl, images, width, height },
  ref
) {
  const duration = lines.reduce((sum, line) => sum + line.duration, 0);
  return (
    <Player
      ref={ref}
      component={() => (
        <PhotoSlideshow audioUrl={audioUrl} images={images} lines={lines} />
      )}
      durationInFrames={frames(duration)}
      compositionWidth={width}
      compositionHeight={height}
      fps={frames(1)}
      controls
    />
  );
});

SongPlayer.defaultProps = {
  width: 1280,
  height: 720
};
