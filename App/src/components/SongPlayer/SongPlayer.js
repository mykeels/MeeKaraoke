import React, { useEffect } from "react";
import { Player } from "@remotion/player";
import { PhotoSlideshow } from "./components";
import { frames } from "../../common/utils";
import { SlidingSubtitles } from "./components/SlidingSubtitles";
import { Audio } from "remotion";

const apiRootURL = process.env.REACT_APP_API_ROOT;

/**
 * @typedef {object} SongPlayerProps
 * @property {LyricLine[]} lines
 * @property {string} audioUrl
 * @property {string[]} images
 * @property {number} [width]
 * @property {number} [height]
 * @property {boolean} [isFullscreen]
 * @property {() => any} [onPlayEnd]
 * @property {React.FC<{ lines: LyricLine[] }>} [Subtitles]
 * @property {React.FC<{ images: string[] }>} [Background]
 */

/**
 * @type {React.FC<SongPlayerProps & { [key: string]: any } & React.RefAttributes<import("@remotion/player").PlayerRef>>}
 */
export const SongPlayer = React.forwardRef(function SongPlayer(
  {
    lines,
    audioUrl,
    images,
    width,
    height,
    isFullscreen,
    onPlayEnd,
    Background,
    Subtitles
  },
  ref
) {
  if (!ref) {
    ref = React.createRef();
  }
  useEffect(() => {
    if (isFullscreen) {
      try {
        ref.current?.requestFullscreen();
      } catch (err) {
        console.warn("Fullscreen mode unsupported", err);
      }
      ref.current?.play();
    }
    const onFullScreenChange = (e) => {
      if (!e.detail.isFullscreen) {
        typeof onPlayEnd === "function" && onPlayEnd();
      }
    };
    ref.current?.addEventListener("fullscreenchange", onFullScreenChange);
    return () => {
      ref.current?.removeEventListener("fullscreenchange", onFullScreenChange);
    };
  }, []);
  const duration = lines.reduce((sum, line) => sum + line.duration, 0);
  return (
    <Player
      ref={ref}
      component={() => (
        <>
          <Audio src={audioUrl.replace("~", apiRootURL)} />
          <Background images={images} />
          <Subtitles lines={lines} />
        </>
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
  height: 720,
  Subtitles: SlidingSubtitles,
  Background: PhotoSlideshow
};
