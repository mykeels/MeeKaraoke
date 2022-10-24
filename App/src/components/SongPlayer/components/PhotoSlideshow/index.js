import React from "react";
import {
  Audio,
  Sequence,
  Img,
  useVideoConfig
} from "remotion";

import {
  Lifecycle,
  Pulse,
  SlideIn,
  SlideOut,
  ZoomIn
} from "../../../../animations";
import { CenterFill } from "../CenterFill";
import { f2s, frames, starts } from "../../../../common/utils";
import classNames from "classnames";
import { FadeOut } from "../../../../animations/FadeOut";

const apiRootURL = process.env.REACT_APP_API_ROOT;

/**
 *
 * @param {LyricLine[]} lines
 * @param {string[]} images
 * @param {number} [linesPerImage]
 * @returns {(LyricLine & { imageURL: string })[]}
 */
const mergeLinesWithImages = (lines, images, linesPerImage = 5) => {
  return lines.map((line, i) => ({
    ...line,
    from: line.from,
    duration: line.duration,
    imageURL:
      images[
        Math.min(
          images.length - 1,
          (Math.floor(i) + linesPerImage - (Math.floor(i) % 5)) / 5 - 1
        )
      ]
  }));
};

/**
 * @typedef {object} PhotoSlideshowProps
 * @property {any} [className]
 * @property {LyricLine[]} lines
 * @property {string} audioUrl
 * @property {string[]} images
 */

/**
 * @type {React.FC<PhotoSlideshowProps & { [key: string]: any }>}
 */
export const PhotoSlideshow = ({ lines, audioUrl, images }) => {
  const startTimes = starts(lines.map((l) => frames(l.duration)));
  const linesWithImages = mergeLinesWithImages(lines, images);
  const { durationInFrames } = useVideoConfig();
  const durationInSeconds = f2s(durationInFrames);
  const imageCount = Math.ceil(durationInSeconds / 5);
  const repeatedImages = new Array(imageCount)
    .fill(0)
    .map((_, i) => images[i % images.length]);
  const bgColor = (i) => {
    const colors = ["bg-purple-200", "bg-lavender-200"];
    return colors[i % colors.length];
  };
  return (
    <>
      <Audio src={audioUrl.replace("~", apiRootURL)} />
      <CenterFill>
        {repeatedImages.map((image, i) => (
          <Sequence
            key={`${image}-${i}`}
            from={i * frames(5)}
            durationInFrames={frames(7)}
            layout="none"
          >
            <Lifecycle
              className={{
                relative: false,
                "absolute top-0 left-0": true
              }}
              ratio={`5:2`}
              Exit={(props) => <FadeOut {...props} />}
              Main={(props) => <ZoomIn {...props} size={0.3} />}
              style={{ zIndex: 10 - (i % 10) }}
            >
              <Img className="h-full w-full block" src={image} />
            </Lifecycle>
          </Sequence>
        ))}
      </CenterFill>
      {linesWithImages.map((line, i) =>
        line.text ? (
          <Sequence
            key={`${line.text}-${i}`}
            from={line.from ? frames(line.from - 0.75) : startTimes[i]}
            durationInFrames={frames(line.duration + 1)}
          >
            <CenterFill>
              <Lifecycle
                className="z-10"
                ratio={`1:2:1`}
                Entrance={(props) => <SlideIn {...props} from="left" />}
                Exit={(props) => <SlideOut {...props} to="right" />}
                Main={(props) => <Pulse {...props} />}
                duration={line.duration + 1}
              >
                <div className="h-24 relative w-full text-center flex items-center justify-center">
                  <div
                    className={classNames(
                      "h-24 w-full z-0 opacity-75 rounded absolute top-0 left-0",
                      bgColor(i)
                    )}
                  />
                  <div className="z-10 relative text-white text-xs lg:text-lg xl:text-xl font-bold p-4">
                    {line.text}
                  </div>
                </div>
              </Lifecycle>
            </CenterFill>
          </Sequence>
        ) : null
      )}
    </>
  );
};

PhotoSlideshow.defaultProps = {};
