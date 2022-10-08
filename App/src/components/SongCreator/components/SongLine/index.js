import classNames from "classnames";
import { DateTime } from "luxon";
import React from "react";

/**
 * @param {object} props
 * @param {number} props.cursor
 * @param {{ text: string, duration: number, from: number }} props.line
 * @param {(text: string) => Promise<string>} [props.getImageURL]
 * @param {(imageURL: string) => any} [props.onImageChange]
 * @returns {JSX.Element}
 */
export const SongLine = ({ cursor, line, ...props }) => {
  return (
    <div
      {...props}
      className={classNames(
        "p-2 block w-full border-b border-gray-100 text-xs",
        {
          "bg-blue-100":
            cursor > line.from && cursor <= line.from + line.duration
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
