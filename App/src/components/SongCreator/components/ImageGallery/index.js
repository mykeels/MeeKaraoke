import "./ImageGallery.css";

import classNames from "classnames";
import React, { useCallback, useEffect } from "react";
import { useMedia } from "../../../../hooks";

/**
 * @param {object} props
 * @param {number} props.cursor
 * @param {string[]} props.images
 * @param {LyricLine} props.line
 * @param {JSX.Element} [props.children]
 * @returns {JSX.Element}
 */
export const ImageGallery = ({ cursor, images, line, children }) => {
  const index = Math.min(
    images.length - 1,
    (Math.floor(cursor) + 5 - (Math.floor(cursor) % 5)) / 5 - 1
  );
  const current = images[index];

  useEffect(() => {
    /** @type {HTMLDivElement} */
    const parentElem = document.querySelector(".image-slider-wrapper");
    /** @type {HTMLDivElement} */
    const elem = document.querySelector(`.gallery-image-${index}`);
    if (elem) {
      const left =
        elem?.offsetLeft - parentElem?.clientWidth / 2 + elem?.clientWidth / 2;
      parentElem.scrollTo({
        left,
        behavior: "smooth"
      });
    }
  }, [cursor, index]);

  const isLgScreen = useMedia(["(min-width: 1024px)"], [true], false);
  const Component = useCallback(() => children, []);

  return (
    <div className="flex lg:block w-full bg-pink border-2 border-purple-100 p-2 justify-center items-center">
      <div className="inline-block lg:flex bg-pink preview relative w-5/12 lg:w-full">
        {children ? (
          <Component />
        ) : (
          <>
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
                  <div className="h-24 bg-purple-200 w-full z-0 opacity-50 rounded absolute top-0 left-0" />
                  <div className="z-10 relative text-white text-xs lg:text-lg xl:text-xl font-bold p-4">
                    {line.text}
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
      <div className="px-2 lg:py-2 inline-block"></div>
      <div className="inline-block lg:block rounded overflow-auto image-slider-wrapper w-7/12 lg:w-full px-4 lg:px-0">
        <div
          className="block image-slider"
          style={{
            width: isLgScreen
              ? `${images.length * 176}px`
              : `${images.length * 80}px`
          }}
        >
          <ul className="list-none">
            {images.map((image, i) => (
              <li key={`${image}-${i}`} className="inline-block py-1 px-1">
                <img
                  className={classNames(
                    "shadow rouded border-2",
                    `gallery-image-${i}`,
                    {
                      "border-purple-100": i !== index,
                      "border-white": i === index
                    }
                  )}
                  src={image}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
