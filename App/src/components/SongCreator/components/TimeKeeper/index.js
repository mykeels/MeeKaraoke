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
      setRecordMs(0);
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
    setMs(value);
  }, [value]);
  return (
    <div className="flex w-full text-center items-center justify-center">
      <button
        className={classNames("text-2xl mx-4 record", {
          "hover:animate-pulse": recordMs === null
        })}
        onClick={() => record()}
      >
        {recordMs !== null ? "🔴" : "⏺️"}
      </button>
      {!clock ? (
        <button
          className="text-4xl mx-4 hover:animate-pulse"
          onClick={() => start()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
            />
          </svg>
        </button>
      ) : null}
      {clock ? (
        <button className="text-4xl mx-4" onClick={() => stop()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
            />
          </svg>
        </button>
      ) : null}

      {DateTime.fromMillis(ms).toFormat("mm:ss:SSS")}
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
