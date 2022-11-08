import React from "react";
import { Audio, Sequence, Img, useVideoConfig } from "remotion";

import { Lifecycle, ZoomIn } from "../../../../animations";
import { CenterFill } from "../CenterFill";
import { f2s, frames } from "../../../../common/utils";
import { FadeOut } from "../../../../animations/FadeOut";
import { SlidingSubtitles } from "../SlidingSubtitles";

const apiRootURL = process.env.REACT_APP_API_ROOT;

/**
 * @typedef {object} PhotoSlideshowProps
 * @property {any} [className]
 * @property {LyricLine[]} lines
 * @property {string} audioUrl
 * @property {string[]} images
 * @property {React.FC<{ lines: LyricLine[] }>} [Subtitles]
 */

/**
 * @type {React.FC<PhotoSlideshowProps & { [key: string]: any }>}
 */
export const PhotoSlideshow = ({ lines, audioUrl, images, Subtitles }) => {
  const { durationInFrames, width, height } = useVideoConfig();
  const durationInSeconds = f2s(durationInFrames);
  const imageCount = Math.ceil(durationInSeconds / 5);
  const repeatedImages = new Array(imageCount)
    .fill(0)
    .map((_, i) => images[i % images.length]);
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
              <Img
                className="h-full w-full block"
                src={image.replace("&w=1280", `&w=${width}`)}
                style={{ width, height }}
              />
            </Lifecycle>
          </Sequence>
        ))}
      </CenterFill>
      {<Subtitles lines={lines} />}
    </>
  );
};

PhotoSlideshow.defaultProps = {
  Subtitles: SlidingSubtitles
};
