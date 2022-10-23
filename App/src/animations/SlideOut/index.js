import React, { useEffect } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * @typedef {object} SlideOutProps
 * @property {any} children
 * @property {"top"|"bottom"|"left"|"right"} [to]
 * @property {(style: React.CSSProperties) => any} [onChange]
 */

/**
 * @type {React.FC<SlideOutProps & { [key: string]: any }>}
 */
export const SlideOut = ({ children, to, onChange }) => {
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

SlideOut.defaultProps = {
  duration: 1,
  to: "bottom"
};
