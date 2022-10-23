import React, { useEffect } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * @typedef {object} SlideInProps
 * @property {React.FC<{ style: React.CSSProperties }>} [children]
 * @property {"top"|"bottom"|"left"|"right"} [from]
 * @property {(style: React.CSSProperties) => any} [onChange]
 */

/**
 * @type {React.FC<SlideInProps & { [key: string]: any }>}
 */
export const SlideIn = ({ children, from, onChange }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

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

  useEffect(() => {
    typeof onChange === "function" && onChange({ transform });
  }, [transform]);
  useEffect(() => {
    return () => {
      typeof onChange === "function" && onChange(null);
    };
  }, []);

  const Component = children;

  return children ? (
    typeof children === "function" ? (
      <Component style={{ transform }} />
    ) : (
      <div className="relative" style={{ transform }}>
        {children}
      </div>
    )
  ) : null;
};

SlideIn.defaultProps = {
  duration: 1,
  from: "bottom"
};
