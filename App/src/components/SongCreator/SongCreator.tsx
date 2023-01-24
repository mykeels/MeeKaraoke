import "./SongCreator.css";

import React, { useCallback, useEffect, useRef, useState } from "react";
import rake from "rake-js";
import classNames from "classnames";

import { LyricsTabView } from "./components/LyricsTabView";
import { TimeKeeper } from "./components/TimeKeeper";
import { ImageGallery } from "./components/ImageGallery";
import { BackgroundSelect } from "./components/BackgroundSelect";
import { ColorGallery } from "./components/ColorGallery";
import { StillHighlightedVerseSubtitles } from "../SongPlayer";
import { assert, setDefaultProps } from "../../common/utils";

const getCurrentLineIndex = (song: LyricLine[], timeInSeconds: number) => {
  return song.findIndex(
    (line) =>
      timeInSeconds > line.from && timeInSeconds <= line.from + line.duration
  );
};

const getLineTime = (song: LyricLine[], currentLine: LyricLine) => {
  let sum = 0.01;
  for (let line of song) {
    if (
      line === currentLine ||
      (line.text === currentLine.text && line.from === currentLine.from)
    ) {
      return sum;
    }
    sum += line.duration;
  }
  return sum;
};

const transformSongLines = (lines: LyricLine[]) => {
  const starts = (durations: number[]) => {
    let sum = 0;
    const arr = [];
    for (let i = 0; i < durations.length; i++) {
      sum += durations[i - 1] || 0;
      arr.push(sum);
    }
    return arr;
  };
  const startTimes = starts(lines.map((l) => l.duration));
  return lines.map((line, i) => ({
    ...line,
    from: startTimes[i]
  }));
};

type SongCreatorProps = {
  className?: string;
  id?: string;
  title?: string;
  audioUrl: string;
  getImages?: (lines: LyricLine[], interval?: number) => Promise<string[]>;
  onSave?: (song: SongFileContent) => Promise<any>;
  LyricsTabView: React.FC<Omit<Parameters<typeof LyricsTabView>[0], "defaults">>;
  onReset?: () => any;
  defaults?: {
    lines: LyricLine[];
    background: SongBackground<"colors" | "images">;
  };
  getAbsoluteAudioUrl?: (relativeAudioUrl: string) => string;
};

export const SongCreator = ({
  id,
  title,
  audioUrl,
  className,
  getImages,
  LyricsTabView,
  onReset,
  defaults,
  onSave,
  getAbsoluteAudioUrl
}: SongCreatorProps) => {
  const [lines, setLines] = useState<LyricLine[]>(defaults?.lines || []);
  const [cursor, setCursor] = useState(0);
  const [recordCursor, setRecordCursor] = useState(0);
  const [timeReset, setTimeReset] = useState(0);

  const currentLine = lines[Math.max(cursor, recordCursor)];

  const [background, setBackground] = useState<
    SongBackground<"colors" | "images">
  >({
    type: defaults?.background.type || "images",
    images: defaults?.background.images || [],
    colors: defaults?.background.colors || [
      `#00aaff`,
      `#ffaa00`,
      `#0000ff`,
      `#00ff00`,
      `#ff0000`,
      `#00aaff`
    ]
  });

  useEffect(() => {
    if (!defaults?.background.images?.length) {
      assert(getImages)(lines).then((images) =>
        setBackground({
          ...background,
          images
        })
      );
    }
  }, [lines]);

  useEffect(() => {
    if (defaults?.lines?.length) {
      setLines(defaults?.lines || []);
    }
    if (defaults?.background.images?.length) {
      setBackground({
        ...background,
        images: defaults?.background.images || []
      });
    }
    if (defaults?.background.colors?.length) {
      setBackground({
        ...background,
        colors: defaults?.background.colors || []
      });
    }
  }, [
    defaults?.lines,
    defaults?.background.images,
    defaults?.background.colors
  ]);

  const songPlayerRef = useRef<HTMLAudioElement>();
  const seek = (time: number) => {
    if (songPlayerRef.current) {
      songPlayerRef.current.currentTime = time;
    }
  };

  const Background = useCallback(
    ({ children }: { children: any }) => {
      const dict = {
        images: (
          <ImageGallery
            cursor={Math.max(recordCursor, cursor)}
            images={background.images}
            line={currentLine}
            onChange={(images) => {
              setBackground({ ...background, images, type: "images" });
            }}
          >
            {children}
          </ImageGallery>
        ),
        colors: (
          <ColorGallery
            cursor={Math.max(recordCursor, cursor)}
            colors={background.colors}
            onChange={(colors) =>
              setBackground({ ...background, colors, type: "colors" })
            }
          >
            {children}
          </ColorGallery>
        )
      };

      return dict[background.type];
    },
    [
      background.type,
      background.images,
      background.colors,
      recordCursor,
      cursor
    ]
  );

  return (
    <div
      className={classNames(
        "block h-screen w-screen px-4 lg:px-16 py-8 song-creator overflow-y-auto custom-scroller",
        className
      )}
    >
      <div className="block w-full text-right"></div>
      <div className="block lg:flex w-full">
        <div className="inline-block w-full lg:w-5/12">
          <div className="lg:px-4 sticky top-0">
            <div className="block w-full bg-pink rounded border-2 border-purple-100">
              <TimeKeeper
                value={timeReset}
                onTick={(seconds) => {
                  const newCursor = getCurrentLineIndex(lines, seconds);
                  if (newCursor !== cursor) {
                    setCursor(newCursor);
                  }
                }}
                onRecordTick={(duration) => {
                  setLines((lines) =>
                    transformSongLines(
                      lines.map((line) =>
                        line === currentLine ? { ...line, duration } : line
                      )
                    )
                  );
                  setRecordCursor(recordCursor + 1);
                }}
                onStart={() => {
                  songPlayerRef.current?.play();
                }}
                onStop={(isRecording) => {
                  songPlayerRef.current?.pause();
                  if (!isRecording) {
                    seek(0);
                    setCursor(0);
                    setRecordCursor(0);
                  } else {
                    const seconds = getLineTime(lines, currentLine);
                    setTimeReset(seconds);
                    seek(seconds);
                    setCursor(getCurrentLineIndex(lines, seconds));
                    setRecordCursor(recordCursor);
                  }
                }}
              />
            </div>
            <div className="block py-2"></div>

            <>
              <div className="flex lg:block w-full bg-pink border-2 border-purple-100 p-2 justify-center items-center">
                <BackgroundSelect
                  value={background.type}
                  // @ts-ignore
                  onChange={(type) => setBackground({ ...background, type })}
                />
                <audio
                  key={audioUrl}
                  src={assert(getAbsoluteAudioUrl)(audioUrl)}
                  ref={songPlayerRef as any}
                ></audio>
                <Background>
                  {lines?.length ? (
                    <StillHighlightedVerseSubtitles
                      cursor={Math.max(recordCursor, cursor)}
                      lines={lines}
                    />
                  ) : null}
                </Background>
              </div>
            </>
          </div>
        </div>
        <div className="py-2 block lg:hidden"></div>
        <div className="inline-block w-full lg:w-7/12 p-4 bg-pink rounded border-2 border-purple-100">
          <LyricsTabView
            cursor={Math.max(recordCursor, cursor)}
            lines={lines}
            onLinesChanged={(lines: LyricLine[]) => {
              setLines(lines);
              if (lines.length !== lines.length) {
                assert(getImages)(lines).then((images) =>
                  setBackground({ ...background, images })
                );
              }
            }}
            onLineClick={(line: LyricLine, i: number) => {
              const seconds = getLineTime(lines, lines[i]);
              setTimeReset(seconds);
              seek(seconds);
              setRecordCursor(getCurrentLineIndex(lines, seconds));
              setCursor(getCurrentLineIndex(lines, seconds));
            }}
            onSave={() => {
              const data: SongFileContent = {
                id,
                title: title || "karaoke",
                lines,
                background,
                duration: lines.reduce((sum, line) => sum + line.duration, 0),
                lyrics: lines.map((line) => line.text).join("\n"),
                audioUrl
              };
              typeof onSave === "function" && onSave(data);
            }}
            onClear={() => {
              setLines([]);
              setCursor(0);
              setRecordCursor(0);
              setTimeReset(0);
              typeof onReset === "function" && onReset();
            }}
          ></LyricsTabView>
        </div>
      </div>
    </div>
  );
};

setDefaultProps(SongCreator, {
  title: "karaoke",
  getImages,
  LyricsTabView,
  onReset: () => {},
  defaults: {
    background: {
      type: "images",
      images: [],
      colors: []
    },
    lines: []
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

async function getImages(lines: LyricLine[], intervals = 5) {
  let cursor = intervals;
  let texts: string[] = [];
  const keywords = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isWithinBounds =
      cursor - intervals <= line.from && cursor >= line.from + line.duration;
    if (isWithinBounds) {
      texts.push(line.text);
    } else {
      cursor += intervals;
      keywords.push(rake(texts.join("\n"), { language: "english" }).join(" "));
      texts = [line.text];
    }
  }
  return Promise.all(
    keywords.map((keyword) =>
      fetch(`https://source.unsplash.com/random/1280x720/?${keyword}`).then(
        (res) => res.url
      )
    )
  );
}
