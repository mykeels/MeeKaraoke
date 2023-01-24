import React from "react";
import { CenterFill, HighlightedVerseSubtitles, PhotoSlideshow } from "..";
import { Audio } from "remotion";
import { ColorTransitions } from "../../../../animations";
import { assert, setDefaultProps } from "../../../../common";

const apiRootURL = process.env.REACT_APP_API_ROOT;

type SongVideoProps = {
  song: Pick<SongFileContent, "audioUrl" | "background" | "lines">;
  Subtitles?: (props: { lines: LyricLine[] }) => JSX.Element;
  Background?: React.FC<SongBackground<"colors" | "images">>;
  root?: string;
  getAbsoluteAudioUrl?: (relativeAudioUrl: string) => string;
};

export const SongVideo = React.forwardRef(function SongVideo(
  { song, Background, Subtitles, getAbsoluteAudioUrl }: SongVideoProps,
  ref: React.ForwardedRef<HTMLAudioElement>
) {
  return (
    <>
      <Audio src={assert(getAbsoluteAudioUrl)(song.audioUrl)} ref={ref} />
      {typeof Background === "function" ? (
        <Background {...song.background} />
      ) : null}
      {typeof Subtitles === "function" ? (
        <Subtitles lines={song.lines || []} />
      ) : null}
    </>
  );
});

setDefaultProps(SongVideo, {
  Subtitles: HighlightedVerseSubtitles,
  Background: ({
    type,
    images,
    colors
  }: SongBackground<"colors" | "images">) => {
    const isColors = type === "colors";
    return isColors ? (
      <ColorTransitions colors={colors}>
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
  },
  getAbsoluteAudioUrl: (audioUrl) =>
    audioUrl.replace(
      "~",
      assert(
        process.env.REACT_APP_API_ROOT,
        "env [REACT_APP_API_ROOT] is not defined"
      )
    )
});
