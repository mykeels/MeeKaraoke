import '../../index.css';

import React from "react";
import { Composition, registerRoot } from "remotion";
import { frames } from "../../common";
import { SongURLPlayer } from "./SongURLPlayer";

/**
 * @typedef {object} SongURLCompositionProps
 * @property {any} [className]
 */

/**
 * @type {React.FC<SongURLCompositionProps & { [key: string]: any }>}
 */
export const SongURLComposition = () => {
  const duration = Number(
    process.env.REACT_APP_VIDEO_DURATION ||
      process.env.REMOTION_VIDEO_DURATION ||
      20
  );
  return (
    <Composition
      id="SongURLPlayer"
      component={({ url }) => (
        <SongURLPlayer url={url} onDurationChange={() => {}} />
      )}
      durationInFrames={frames(duration)}
      fps={frames(1)}
      width={1920}
      height={1080}
    />
  );
};

SongURLComposition.defaultProps = {};

registerRoot(SongURLComposition);
