import classNames from "classnames";
import React from "react";

/**
 * @param {object} props
 * @param {number} props.cursor
 * @param {string[]} props.images
 * @returns {JSX.Element}
 */
export const ImageGallery = ({ cursor, images }) => {
  const index = Math.min(
    images.length - 1,
    (Math.floor(cursor) + 5 - (Math.floor(cursor) % 5)) / 5 - 1
  );
  const current = images[index];
  return (
    <img
      src={current}
      className={classNames("block w-full h-full", {
        "border-2 rounded border-yellow-200": cursor > 0
      })}
    />
  );
};
