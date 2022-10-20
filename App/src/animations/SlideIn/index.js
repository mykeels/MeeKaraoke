import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * @typedef {object} SlideInProps
 * @property {any} children
 * @property {number} [duration] duration in seconds
 * @property {"top"|"bottom"|"left"|"right"} [from]
 */

/**
 * @type {React.FC<SlideInProps & { [key: string]: any }>}
 */
export const SlideIn = ({ children, duration, from }) => {
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
    bottom: [height, 0],
    right: [width, 0],
    top: [-height, 0],
    left: [-width, 0]
  }[from];

  const entranceOffset = interpolate(entrance, [0, 1], outputRange);

  const wave = Math.cos(frame / 15) * 10 + entranceOffset;

  const transform = ["top", "bottom"].includes(from)
    ? `translateY(${wave}px)`
    : `translateX(${wave}px)`;
  return (
    <div className="relative" style={{ transform }}>
      {children}
    </div>
  );
};

SlideIn.defaultProps = {
  duration: 1,
  from: "bottom"
};
