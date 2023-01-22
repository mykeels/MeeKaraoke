import classNames from "classnames";
import { DateTime } from "luxon";
import React, { useEffect, useRef } from "react";

type SongLineProps = {
  isActive: boolean;
  line: LyricLine;
};


export const SongLine = ({ isActive, line, ...props }: SongLineProps) => {
  const ref = useRef<HTMLDivElement>();
  useEffect(() => {
    if (isActive) {
      ref?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isActive]);

  return (
    <div
      {...props}
      ref={ref as React.RefObject<HTMLDivElement>}
      className={classNames(
        "p-2 block w-full border-b border-gray-100 text-xs lg:text-lg xl:text-xl cursor-pointer",
        {
          "bg-lavender-100": isActive
        }
      )}
    >
      <div className="inline-block w-5/6">{line.text}</div>
      <div className="inline-block w-1/6">
        <div className="block w-full">
          <div className="inline-block w-1/2"></div>
          <div className="inline-block w-1/2">
            {DateTime.fromSeconds(line.duration).toFormat("mm:ss")}
          </div>
        </div>
      </div>
    </div>
  );
};

SongLine.defaultProps = {};
