import React, { useEffect } from "react";
import { Player } from "@remotion/player";
import { CenterFill, HighlightedVerseSubtitles } from "./components";
import { frames } from "../../common/utils";
import { Audio } from "remotion";
import { ColorTransitions } from "../../animations";

const apiRootURL = process.env.REACT_APP_API_ROOT;

/**
 * @typedef {object} SongVideoProps
 * @property {LyricLine[]} lines
 * @property {string} audioUrl
 * @property {string[]} images
 * @property {React.FC<{ lines: LyricLine[] }>} [Subtitles]
 * @property {React.FC<{ images: string[] }>} [Background]
 */

/**
 * @type {React.FC<SongVideoProps & { [key: string]: any } & React.RefAttributes<import("@remotion/player").PlayerRef>>}
 */
export const SongVideo = ({
  lines,
  audioUrl,
  images,
  Background,
  Subtitles
}) => {
  return (
    <>
      <Audio src={audioUrl.replace("~", apiRootURL)} />
      <Background images={images} />
      <Subtitles lines={lines} />
    </>
  );
};

SongVideo.defaultProps = {
  Subtitles: HighlightedVerseSubtitles,
  Background: () => (
    <ColorTransitions
      colors={[
        `#75dddd`,
        `#84c7d0`,
        `#9297c4`,
        `#9368b7`,
        `#7ED0EE`,
        `#f5bf69`
      ]}
    >
      {({ style }) => (
        <CenterFill className="z-10" style={{ backgroundColor: style.color }} />
      )}
    </ColorTransitions>
  )
};

/**
 * @typedef {object} SongPlayerProps
 * @property {LyricLine[]} lines
 * @property {string} audioUrl
 * @property {string[]} images
 * @property {boolean} [controls]
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
    controls,
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
        <SongVideo
          audioUrl={audioUrl}
          images={images}
          lines={lines}
          Background={Background}
          Subtitles={Subtitles}
        />
      )}
      durationInFrames={frames(duration)}
      compositionWidth={width}
      compositionHeight={height}
      fps={frames(1)}
      controls={controls}
    />
  );
});

SongPlayer.defaultProps = {
  width: 1280,
  height: 720,
  controls: true
};
