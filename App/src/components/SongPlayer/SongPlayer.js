import React, { useEffect } from "react";
import { Player } from "@remotion/player";
import {
  CenterFill,
  HighlightedVerseSubtitles,
  PhotoSlideshow
} from "./components";
import { frames } from "../../common/utils";
import { Audio } from "remotion";
import { ColorTransitions } from "../../animations";

const apiRootURL = process.env.REACT_APP_API_ROOT;

/**
 * @typedef {object} SongVideoProps
 * @property {Pick<SongFileContent, "audioUrl" | "background" | "lines">} song
 * @property {React.FC<{ lines: LyricLine[] }>} [Subtitles]
 * @property {React.FC<SongBackground<"colors" | "images">>} [Background]
 */

/**
 * @type {React.FC<SongVideoProps & { [key: string]: any } & React.RefAttributes<import("@remotion/player").PlayerRef>>}
 */
export const SongVideo = ({ song, Background, Subtitles }) => {
  return (
    <>
      <Audio src={song.audioUrl.replace("~", apiRootURL)} />
      <Background {...song.background} />
      <Subtitles lines={song.lines} />
    </>
  );
};

SongVideo.defaultProps = {
  Subtitles: HighlightedVerseSubtitles,
  /**
   * 
   * @type {React.FC<SongBackground<"colors" | "images">>}
   */
  Background: ({ type, images, colors }) => {
    const isColors = type === "colors";
    return isColors ? (
      <ColorTransitions
        colors={colors}
      >
        {({ style }) => (
          <CenterFill
            className="z-10"
            style={{ backgroundColor: style.color }}
          />
        )}
      </ColorTransitions>
    ) : (
      <PhotoSlideshow images={images} />
    );
  }
};

/**
 * @typedef {object} SongPlayerProps
 * @property {Pick<SongFileContent, "audioUrl" | "background" | "lines">} song
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
    song,
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
  const duration = song.lines.reduce((sum, line) => sum + line.duration, 0);
  return (
    <Player
      ref={ref}
      component={() => (
        <SongVideo song={song} Background={Background} Subtitles={Subtitles} />
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
