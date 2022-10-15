import "./TimeKeeper.css";

import classNames from "classnames";
import { DateTime } from "luxon";
import React, { useEffect, useRef, useState } from "react";

/**
 * @param {object} props
 * @param {number} [props.value]
 * @param {() => any} props.onStart
 * @param {() => any} props.onStop
 * @param {(seconds: number) => any} props.onTick
 * @param {(interval: number) => any} props.onRecordTick
 * @returns {JSX.Element}
 */
export const TimeKeeper = ({
  value,
  onStart,
  onStop,
  onTick,
  onRecordTick
}) => {
  const [clock, setClock] = useState(false);
  const [ms, setMs] = useState(0);
  const [recordMs, setRecordMs] = useState(null);
  /** @type {import("react").MutableRefObject<NodeJS.Timer>} */
  const intervalRef = useRef();
  const start = () => {
    if (clock) {
      return;
    }
    setClock(true);
    intervalRef.current = setInterval(() => {
      setMs((ms) => ms + 250);
    }, 250);
    onStart();
  };
  const stop = () => {
    setClock(false);
    intervalRef.current && clearInterval(intervalRef.current);
    setMs(0);
    setRecordMs(null);
    onStop();
  };
  const record = () => {
    if (!clock) {
      setRecordMs(ms);
      start();
    } else {
      onRecordTick((ms - recordMs) / 1000);
      setRecordMs(ms);
    }
  };
  const isRecording = recordMs !== null;
  useEffect(() => {
    if (!isRecording) {
      typeof onTick === "function" && onTick(ms / 1000);
    }
  }, [ms]);
  useEffect(() => {
    setMs(value * 1000);
  }, [value]);
  const isPlaying = !!clock;
  return (
    <div className="block w-full px-2 py-2">
      <button
        className={classNames("record")}
        onClick={() => record()}
        disabled={isPlaying && !isRecording}
      >
        <span
          className={classNames(
            "inline-block text-center text-white px-4 py-2 text-xs rounded shadow hover:bg-purple-200",
            {
              "bg-purple-200": isRecording,
              "bg-purple-100": !isRecording,
              "bg-pink cursor-not-allowed": isPlaying && !isRecording
            }
          )}
        >
          {isRecording ? "Next Line" : "Record ⏺️"}
        </span>
      </button>
      <button
        className="px-2 play"
        onClick={() => (isPlaying ? stop() : start())}
      >
        <span
          className={classNames(
            "inline-block text-center text-white px-4 py-2 text-xs rounded shadow hover:bg-purple-200",
            {
              "bg-purple-200": isPlaying,
              "bg-purple-100": !isPlaying
            }
          )}
        >
          {isPlaying ? "Stop" : "Play"}
        </span>
      </button>

      <span className="inline-block float-right text-purple-200 text-lg font-bold px-4">
        {DateTime.fromMillis(ms).toFormat("mm:ss:SSS")}
      </span>
    </div>
  );
};

TimeKeeper.defaultProps = {
  value: 0,
  onStart: () => {},
  onStop: () => {},
  onTick: () => {},
  onRecordTick: () => {}
};
