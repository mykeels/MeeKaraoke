import "./LyricsTabView.css";

import classNames from "classnames";
import React, { useEffect, useState } from "react";

import { SongLine } from "../SongLine";

/**
 * @param {object} props
 * @param {{ lyrics: string, active: string }} [props.defaults]
 * @param {number} [props.cursor]
 * @param {(lines: Song) => any} [props.onSongChanged]
 * @returns {JSX.Element}
 */
export const LyricsTabView = ({ cursor, defaults, onSongChanged }) => {
  const [active, setActive] = useState(defaults?.active || "text");
  const [lyrics, setLyrics] = useState(defaults?.lyrics || "");
  /** @type {[Song, React.Dispatch<React.SetStateAction<Song>>]} */
  const [songLines, setSongLines] = useState([]);
  const starts = (durations) => {
    let sum = 0;
    const arr = [];
    for (let i = 0; i < durations.length; i++) {
      sum += durations[i - 1] || 0;
      arr.push(sum);
    }
    return arr;
  };
  /** @param {Song} lines */
  const updateSongLines = (lines) => {
    const startTimes = starts(lines.map((l) => l.duration));
    const linesWithFrom = lines.map((line, i) => ({
      ...line,
      from: startTimes[i]
    }));
    setSongLines(linesWithFrom);
    onSongChanged(linesWithFrom);
  };
  /** @param {string} lyrics */
  const updateSongLyrics = (lyrics) => {
    const lines = lyrics
      .replace(/\n\n+/g, "\n\n")
      .split("\n")
      .map((line) => line.trim())
      .map((text) => ({
        text,
        imageURL: "",
        duration: 1,
        from: 0
      }));
    updateSongLines(lines);
  };

  useEffect(() => {
    updateSongLyrics(lyrics);
  }, [lyrics]);

  return (
    <div className="w-full">
      <ul
        className="nav nav-tabs flex flex-row flex-wrap list-none border-b-0 pl-0 justify-end"
        role="tablist"
      >
        <li className="nav-item" role="presentation">
          <button
            className={classNames(
              "w-full block text-xs leading-tight uppercase px-6 py-2 hover:bg-gray-100",
              {
                "bg-gray-100": active === "pretty"
              }
            )}
            onClick={() => setActive("pretty")}
            role="tab"
            aria-selected="true"
          >
            Pretty
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={classNames(
              "w-full block text-xs leading-tight uppercase px-6 py-2 hover:bg-gray-100",
              {
                "bg-gray-100": active === "text"
              }
            )}
            onClick={() => setActive("text")}
            role="tab"
            aria-selected="false"
          >
            Text
          </button>
        </li>
      </ul>
      <div className="tab-content py-2">
        {active === "pretty" ? (
          <div>
            {songLines.map((line, i) => (
              <SongLine
                key={`${line}-${i}`}
                cursor={cursor}
                line={line}
              ></SongLine>
            ))}
          </div>
        ) : (
          <div>
            <textarea
              className="h-64 w-full p-2 focus:outline-none bg-gray-100 custom-scroller text-xs"
              placeholder="Paste Song Lyrics here"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
};

LyricsTabView.defaultProps = {
  cursor: 0,
  onSongChanged: () => {}
};
