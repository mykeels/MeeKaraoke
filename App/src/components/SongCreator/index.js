import "./SongCreator.css";

import React, { useEffect, useRef, useState } from "react";
import { LyricsTabView } from "./components/LyricsTabView";
import axios from "axios";
import rake from "rake-js";
import { TimeKeeper } from "./components/TimeKeeper";
import { ImageGallery } from "./components/ImageGallery";
import { DateTime } from "luxon";
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
 *
 * @param {object} props
 * @param {string} props.text
 * @param {string} props.className
 * @param {(lines: Song, interval?: number) => Promise<string[]>} props.getImages
 * @returns {JSX.Element}
 */
export const SongCreator = ({ text, className, getImages }) => {
  /** @type {ReactState<Song>} */
  const [song, setSong] = useState([]);
  /** @type {ReactState<string[]>} */
  const [images, setImages] = useState([]);
  /** @type {ReactState<number>} */
  const [cursor, setCursor] = useState(0);
  /** @type {import("react").MutableRefObject<HTMLAudioElement>} */
  const audioRef = useRef();

  /** @type {ReactState<number>} */
  const [recordCursor, setRecordCursor] = useState(0);
  const currentLine = song[Math.max(cursor, recordCursor)];

  const [timeReset, setTimeReset] = useState(0);

  useEffect(() => {
    getImages(song).then(setImages);
  }, [song.length]);

  return (
    <div
      className={classNames(
        "block h-screen w-screen px-16 py-8 song-creator overflow-auto",
        className
      )}
    >
      <div className="block w-full text-right"></div>
      <div className="flex w-full">
        <div className="inline-block w-full md:w-5/12">
          <div className="px-4 sticky top-0">
            <audio ref={audioRef}>
              <source
                src="./sounds/something-just-like-this.mp3"
                type="audio/mpeg"
              />
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
        <div className="inline-block w-full md:w-7/12 p-4 bg-pink rounded border-2 border-purple-100">
          <LyricsTabView
            defaults={{
              text,
              active: "text"
            }}
            cursor={Math.max(recordCursor, cursor)}
            song={song}
            onSongChanged={setSong}
            onLineClick={(line) => {
              const seconds = getLineTime(song, line);
              setTimeReset(seconds);
              audioRef.current.currentTime = seconds;
              setRecordCursor(getCurrentLineIndex(song, seconds));
              setCursor(getCurrentLineIndex(song, seconds));
            }}
            onSave={() => {
              const data = {
                lines: song,
                images,
                duration: song.reduce((sum, line) => sum + line.duration, 0)
              };
              const blob = new Blob([JSON.stringify(data, null, 2)]);
              const url = URL.createObjectURL(blob);
              const downloadElem = document.createElement("a");
              downloadElem.setAttribute("href", url);
              downloadElem.setAttribute(
                "download",
                `karaoke-${DateTime.local().toFormat(
                  "yyyy-MM-dd-hh-mm-ss"
                )}.mee.json`
              );
              downloadElem.click();
            }}
            onClear={() => {
              setSong([]);
              setCursor(0);
              setRecordCursor(0);
              setTimeReset(0);
            }}
          ></LyricsTabView>
        </div>
      </div>
    </div>
  );
};

SongCreator.defaultProps = {
  getImages
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
      axios
        .get(`https://source.unsplash.com/random/1280x720/?${keyword}`, {
          maxRedirects: 0
        })
        .then((res) => res.request.responseURL)
    )
  );
}