import classNames from "classnames";
import React from "react";

/**
 * @param {object} props
 * @param {number} props.cursor
 * @param {string[]} props.images
 * @param {LyricLine} props.line
 * @returns {JSX.Element}
 */
export const ImageGallery = ({ cursor, images, line }) => {
  const index = Math.min(
    images.length - 1,
    (Math.floor(cursor) + 5 - (Math.floor(cursor) % 5)) / 5 - 1
  );
  const current = images[index];
  return (
    <div className="flex bg-pink preview relative">
      <img
        src={current}
        className={classNames("block w-full h-full rounded border-2", {
          "border-purple-100": !cursor,
          "border-purple-200": cursor > 0
        })}
      />
      {line?.text ? (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="h-24 relative w-full text-center flex items-center justify-center">
            <div className="h-24 bg-gray-500 w-full z-0 opacity-50 rounded absolute top-0 left-0" />
            <div className="z-10 relative text-white text-sm font-bold p-4">{line.text}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
