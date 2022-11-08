import classNames from "classnames";
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig
} from "remotion";
import { Pulse } from "../../../../animations";
import { frames, starts, isFrameWithin } from "../../../../common";

/**
 * @typedef {object} HighlightedVerseSubtitlesProps
 * @property {any} [className]
 * @property {LyricLine[]} lines
 * @property {number} [count]
 */

/**
 * @param {LyricLine[]} lines
 * @param {number} count
 * @returns {{ lines: LyricLine[], from: number, duration: number, id: number }[]}
 */
const mergeLinesIntoGroups = (lines, count) =>
  lines.reduce((arr, line, id) => {
    /** @type {() => ({ lines: LyricLine[], from: number, duration: 0 })} */
    let last = () => arr[arr.length - 1];
    if (!last() || last().lines.length === count) {
      arr.push({
        id,
        lines: [],
        from: 0,
        duration: 0
      });
    }
    if (last().lines.length < count) {
      if (last().lines.length === 0) {
        last().from = line.from;
      }
      last().lines.push(line);
      last().duration += line.duration;
    }
    return arr;
  }, []);

/**
 * @type {React.FC<HighlightedVerseSubtitlesProps & { [key: string]: any }>}
 */
export const HighlightedVerseSubtitles = ({ lines, count }) => {
  const groups = mergeLinesIntoGroups(lines, count);
  const startTimes = starts(groups.map((g) => frames(g.duration)));
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const fontSize = classNames({
    "text-xs": width <= 320,
    "text-lg": width > 320 && width <= 640,
    "text-xl": width > 640 && width <= 1024,
    "text-4xl": width > 1024
  });
  return (
    <div>
      {groups.map((group, i) => {
        return (
          <Sequence
            key={`${group.id}-${i}`}
            from={group.from ? frames(group.from) : startTimes[i]}
            durationInFrames={frames(group.duration)}
            layout="none"
          >
            <AbsoluteFill className="items-center justify-center z-20">
              <div className="h-24 relative w-full text-center flex items-center justify-center">
                <div className="h-24 w-full z-0 opacity-75 rounded absolute top-0 left-0" />
                <div
                  className={classNames(
                    "z-10 relative text-white font-bold p-4",
                    fontSize
                  )}
                >
                  {group.lines.map((line, i) => {
                    const isActive = isFrameWithin(
                      frame,
                      frames(line.from),
                      frames(line.duration)
                    );
                    const Animation = isActive
                      ? Pulse
                      : ({ children: Component }) => <Component />;
                    return (
                      <Animation key={`${line.text}-${i}`}>
                        {({ style }) =>
                          line.text ? (
                            <div className="block">
                              <span
                                className={classNames(
                                  "inline-block p-2 px-4 rounded my-1",
                                  {
                                    "bg-purple-100": isActive
                                  }
                                )}
                                style={style}
                              >
                                {line.text}
                              </span>
                            </div>
                          ) : null
                        }
                      </Animation>
                    );
                  })}
                </div>
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </div>
  );
};

HighlightedVerseSubtitles.defaultProps = {
  count: 4
};
