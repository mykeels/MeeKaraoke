import React, { useEffect } from "react";
import { Player } from "@remotion/player";

import { assert, frames, setDefaultProps } from "../../common/utils";
import { SongVideo } from "./components";

type SongPlayerProps = {
  className?: any;
  song: Pick<SongFileContent, "audioUrl" | "background" | "lines">;
  controls?: boolean;
  width?: number;
  height?: number;
  isFullscreen?: boolean;
  onPlayEnd?: () => any;
  Subtitles?: (props: { lines: LyricLine[] }) => JSX.Element;
  Background?: React.FC<{
    images: string[];
  }>;
};

export const SongPlayer = React.forwardRef(function SongPlayer(
  {
    song,
    width,
    height,
    isFullscreen,
    controls,
    onPlayEnd,
    Background,
    Subtitles,
    className,
  }: SongPlayerProps,
  ref: React.RefObject<import("@remotion/player").PlayerRef>
) {
  if (!ref) {
    ref = React.createRef() as any;
  }
  useEffect(() => {
    if (isFullscreen) {
      try {
        ref?.current?.requestFullscreen();
      } catch (err) {
        console.warn("Fullscreen mode unsupported", err);
      }
      ref.current?.play();
    }
    const onFullScreenChange = (e: { detail: { isFullscreen: boolean } }) => {
      if (!e.detail.isFullscreen) {
        typeof onPlayEnd === "function" && onPlayEnd();
      }
    };
    const elem = ref.current;
    ref.current?.addEventListener("fullscreenchange", (e) => {});
    return () => {
      elem?.removeEventListener("fullscreenchange", onFullScreenChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const duration =
    song.lines?.reduce((sum, line) => sum + line.duration, 0) || 0;
  return (
    <Player
      ref={ref}
      component={() => (
        <SongVideo song={song} Background={Background} Subtitles={Subtitles} />
      )}
      durationInFrames={frames(duration)}
      compositionWidth={assert(width, "width must be defined")}
      compositionHeight={assert(height, "height must be defined")}
      fps={frames(1)}
      controls={controls}
      className={className}
    />
  );
});

setDefaultProps(SongPlayer, {
  width: 1280,
  height: 720,
  controls: true,
});
