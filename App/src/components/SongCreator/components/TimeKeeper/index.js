import { DateTime } from "luxon";
import React, { useEffect, useRef, useState } from "react";

/**
 * @param {object} props
 * @param {() => any} props.onStart
 * @param {() => any} props.onStop
 * @param {(seconds: number) => any} props.onTick
 * @returns {JSX.Element}
 */
export const TimeKeeper = ({ onStart, onStop, onTick }) => {
  const [clock, setClock] = useState(false);
  const [ms, setMs] = useState(0);
  /** @type {import("react").MutableRefObject<NodeJS.Timer>} */
  const intervalRef = useRef();
  const start = () => {
    setClock(true);
    intervalRef.current = setInterval(() => {
      setMs(ms => ms + 250);
    }, 250);
    onStart();
  };
  const stop = () => {
    setClock(false);
    intervalRef.current && clearInterval(intervalRef.current);
    setMs(0);
    onStop();
  };
  useEffect(() => {
    typeof onTick === "function" && onTick(ms / 1000);
  }, [ms]);
  return (
    <div className="flex w-full text-center items-center justify-center">
        <button className="text-4xl mx-4">
          ⏺️
        </button>
      {!clock ? (
        <button className="text-4xl mx-4" onClick={() => start()}>
          ▶️
        </button>
      ) : null}
      {clock ? (
        <button className="text-4xl mx-4" onClick={() => stop()}>
          ⏹️
        </button>
      ) : null}

      {DateTime.fromMillis(ms).toFormat("mm:ss:SSS")}
    </div>
  );
};

TimeKeeper.defaultProps = {
    onStart: () => {},
    onStop: () => {},
    onTick: () => {}
}
