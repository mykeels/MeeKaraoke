import "./SongCreator.css";

import React, { useEffect, useRef, useState } from "react";
import { LyricsTabView } from "./components/LyricsTabView";
import rake from "rake-js";
import { TimeKeeper } from "./components/TimeKeeper";
import { ImageGallery } from "./components/ImageGallery";
import classNames from "classnames";

/**
 * @param {Song} song
 * @param {number} timeInSeconds
 */
const getCurrentLineIndex = (song, timeInSeconds) => {
  return song.findIndex(
    (line) =>
      timeInSeconds > line.from && timeInSeconds <= line.from + line.duration
  );
};

/**
 * @param {Song} song
 * @param {LyricLine} currentLine
 */
const getLineTime = (song, currentLine) => {
  let sum = 0.01;
  for (let line of song) {
    if (line === currentLine) {
      return sum;
    }
    sum += line.duration;
  }
  return sum;
};

/** @param {Song} lines */
const transformSongLines = (lines) => {
  const starts = (durations) => {
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

/**
 * @typedef {object} SongCreatorProps
 * @property {string} [className]
 * @property {string} [title]
 * @property {string} url
 * @property {(lines: Song, interval?: number) => Promise<string[]>} [getImages]
 * @property {(song: Omit<SongFileContent, "id"|"lyrics"|"audioUrl">) => Promise<any>} [onSave]
 * @property {React.FC<Omit<Parameters<typeof LyricsTabView>[0], "defaults">>} LyricsTabView
 * @property {() => any} [onReset]
 * @property {{ song: Song, images: string[] }} [defaults]
 */

/**
 * @type {React.FC<SongCreatorProps>}
 */
export const SongCreator = ({
  title,
  url,
  className,
  getImages,
  LyricsTabView,
  onReset,
  defaults,
  onSave
}) => {
  /** @type {ReactState<Song>} */
  const [song, setSong] = useState(defaults?.song || []);
  /** @type {ReactState<string[]>} */
  const [images, setImages] = useState(defaults?.images || []);
  /** @type {ReactState<number>} */
  const [cursor, setCursor] = useState(0);
  /** @type {import("react").MutableRefObject<HTMLAudioElement>} */
  const audioRef = useRef();

  /** @type {ReactState<number>} */
  const [recordCursor, setRecordCursor] = useState(0);
  const currentLine = song[Math.max(cursor, recordCursor)];

  const [timeReset, setTimeReset] = useState(0);

  useEffect(() => {
    if (defaults?.song?.length) {
      setSong(defaults?.song || []);
    }
    if (defaults?.images?.length) {
      setImages(defaults?.images || []);
    }
  }, [defaults?.song, defaults?.images]);

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
            <audio ref={audioRef}>
              <source src={url} type="audio/mpeg" />
            </audio>
            <div className="block w-full bg-pink rounded border-2 border-purple-100">
              <TimeKeeper
                value={timeReset}
                onTick={(seconds) => {
                  setCursor(getCurrentLineIndex(song, seconds));
                }}
                onRecordTick={(duration) => {
                  setSong((lines) =>
                    transformSongLines(
                      lines.map((line) =>
                        line === currentLine ? { ...line, duration } : line
                      )
                    )
                  );
                  setRecordCursor(recordCursor + 1);
                }}
                onStart={() => {
                  audioRef.current.play();
                }}
                onStop={() => {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                  setCursor(0);
                  setRecordCursor(0);
                }}
              />
            </div>
            <div className="block py-2"></div>
            <ImageGallery
              cursor={Math.max(recordCursor, cursor)}
              images={images}
              line={currentLine}
            />
          </div>
        </div>
        <div className="py-2 block lg:hidden"></div>
        <div className="inline-block w-full lg:w-7/12 p-4 bg-pink rounded border-2 border-purple-100">
          <LyricsTabView
            cursor={Math.max(recordCursor, cursor)}
            song={song}
            onSongChanged={(lines) => {
              setSong(lines);
              if (lines.length !== song.length) {
                getImages(lines).then(setImages);
              }
            }}
            onLineClick={(line) => {
              const seconds = getLineTime(song, line);
              setTimeReset(seconds);
              audioRef.current.currentTime = seconds;
              setRecordCursor(getCurrentLineIndex(song, seconds));
              setCursor(getCurrentLineIndex(song, seconds));
            }}
            onSave={() => {
              const data = {
                title,
                song,
                images,
                duration: song.reduce((sum, line) => sum + line.duration, 0)
              };
              onSave(data);
            }}
            onClear={() => {
              setSong([]);
              setCursor(0);
              setRecordCursor(0);
              setTimeReset(0);
              onReset();
            }}
          ></LyricsTabView>
        </div>
      </div>
    </div>
  );
};

SongCreator.defaultProps = {
  title: "karaoke",
  getImages,
  LyricsTabView,
  onReset: () => {},
  defaults: {
    images: [],
    song: []
  }
};

/** @param {Song} lines */
async function getImages(lines, intervals = 5) {
  let cursor = intervals;
  let texts = [];
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
      fetch(`https://source.unsplash.com/random/1280x720/?${keyword}`).then((res) => res.url)
    )
  );
}
