import React, { useEffect } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { assert } from "../../common";

type SlideOutProps = {
  children?: any;
  to?: "top" | "bottom" | "left" | "right";
  durationInFrames?: number;
  onChange?: (props: { transform: string }) => any;
};

export const SlideOut = ({
  children,
  to,
  onChange,
  ...props
}: SlideOutProps) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  const entrance = spring({
    fps,
    frame,
    config: {
      damping: 200
    },
    durationInFrames: props?.durationInFrames || durationInFrames
  });
  const outputRange = {
    bottom: [0, height / 1.5],
    right: [0, width / 1.5],
    top: [0, -height / 1.5],
    left: [0, -width / 1.5]
  }[assert(to)];

  const exitOffset = interpolate(entrance, [0, 1], outputRange);

  const wave = exitOffset;

  const transform = ["top", "bottom"].includes(assert(to))
    ? `translateY(${wave}px)`
    : `translateX(${wave}px)`;

  useEffect(() => {
    typeof onChange === "function" && onChange({ transform });
  }, [transform]);

  const Component = typeof children === "function" ? children : null;

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
