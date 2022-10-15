import "./LyricsTabView.css";

import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

import { SongLine } from "../SongLine";

/**
 * @param {object} props
 * @param {{ text: string, active: string }} [props.defaults]
 * @param {number} [props.cursor]
 * @param {Song} [props.song]
 * @param {(lines: Song) => any} [props.onSongChanged]
 * @param {(line: LyricLine) => any} [props.onLineClick]
 * @param {() => any} [props.onSave]
 * @param {() => any} [props.onClear]
 * @param {() => any} [props.onOpen]
 * @returns {JSX.Element}
 */
export const LyricsTabView = ({
  cursor,
  defaults,
  song,
  onSongChanged,
  onLineClick,
  onSave,
  onClear,
  onOpen
}) => {
  /** @type {import("react").MutableRefObject<HTMLInputElement>} */
  const fileRef = useRef();
  const [active, setActive] = useState(defaults?.active || "text");
  const [text, setText] = useState(defaults?.text || "");
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
    onSongChanged(linesWithFrom);
  };
  /** @param {string} text */
  const updateSongLyrics = (text) => {
    const lines = text
      .replace(/\n\n+/g, "\n\n")
      .split("\n")
      .map((line) => line.trim())
      .map((text, i) => ({
        text,
        duration: song[i]?.duration || 1,
        from: song[i]?.duration || 0
      }));
    updateSongLines(lines);
  };

  useEffect(() => {
    updateSongLyrics(text);
  }, [text]);

  return (
    <div className="w-full">
      <ul
        className="nav nav-tabs flex flex-row flex-wrap list-none border-b-0 pl-0 justify-end"
        role="tablist"
      >
        {text ? (
          <>
            <li className="nav-item" role="presentation">
              <button
                className={classNames(
                  "w-full block text-xs leading-tight uppercase px-6 py-2 hover:bg-purple-100 hover:text-white"
                )}
                role="tab"
                onClick={() => {
                  setText("");
                  onClear();
                }}
              >
                ❌
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={classNames(
                  "w-full block text-xs leading-tight uppercase px-6 py-2 hover:bg-purple-100 hover:text-white"
                )}
                onClick={onSave}
                role="tab"
              >
                💾
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item" role="presentation">
              <button
                className={classNames(
                  "w-full block text-xs leading-tight uppercase px-6 py-2 hover:bg-purple-100 hover:text-white"
                )}
                role="tab"
                onClick={onOpen}
              >
                📂
              </button>
              <input type="file" ref={fileRef} />
            </li>
          </>
        )}
        <li className="nav-item" role="presentation">
          <button
            className={classNames(
              "w-full block text-xs leading-tight uppercase px-6 py-2",
              {
                "bg-purple-200 text-white": active === "pretty",
                "hover:bg-purple-100": active !== "pretty"
              }
            )}
            onClick={() => setActive("pretty")}
            role="tab"
            aria-selected={active === "pretty" ? "true" : "false"}
          >
            Pretty
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={classNames(
              "w-full block text-xs leading-tight uppercase px-6 py-2 hover:bg-purple-100",
              {
                "bg-purple-200 text-white": active === "text",
                "hover:bg-purple-100": active !== "text"
              }
            )}
            onClick={() => setActive("text")}
            role="tab"
            aria-selected={active === "text" ? "true" : "false"}
          >
            Text
          </button>
        </li>
      </ul>
      <div className="tab-content py-2 custom-scroller overflow-y-auto">
        {active === "pretty" ? (
          <div>
            {text ? (
              song.map((line, i) => (
                <SongLine
                  key={`${line}-${i}`}
                  isActive={cursor === i}
                  line={line}
                  // @ts-ignore
                  onClick={() => onLineClick(line)}
                ></SongLine>
              ))
            ) : (
              <div className="text-center w-full">No lyrics found</div>
            )}
          </div>
        ) : (
          <div>
            <textarea
              className="h-75vh w-full p-2 bg-pink text-purple-200 custom-scroller"
              placeholder="Paste Song Lyrics here"
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
};

LyricsTabView.defaultProps = {
  cursor: 0,
  onSongChanged: () => {},
  onLineClick: () => {},
  onSave: () => {},
  onClear: () => {},
  onOpen: () => {}
};
