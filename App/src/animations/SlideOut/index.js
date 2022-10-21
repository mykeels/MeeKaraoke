import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * @typedef {object} SlideOutProps
 * @property {any} children
 * @property {number} [duration] duration in seconds
 * @property {"top"|"bottom"|"left"|"right"} [to]
 */

/**
 * @type {React.FC<SlideOutProps & { [key: string]: any }>}
 */
export const SlideOut = ({ children, duration, to }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const durationInFrames = Math.ceil(fps * duration);

  const entrance = spring({
    fps,
    frame,
    config: {
      damping: 200
    },
    durationInFrames
  });
  const outputRange = {
    bottom: [0, height / 1.5],
    right: [0, width / 1.5],
    top: [0, -height / 1.5],
    left: [0, -width / 1.5]
  }[to];

  const exitOffset = interpolate(entrance, [0, 1], outputRange);

  const wave = exitOffset;

  const transform = ["top", "bottom"].includes(to)
    ? `translateY(${wave}px)`
    : `translateX(${wave}px)`;
  return (
    <div className="relative" style={{ transform }}>
      {children}
    </div>
  );
};

SlideOut.defaultProps = {
  duration: 1,
  from: "bottom"
};
