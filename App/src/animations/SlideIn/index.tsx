import React, { useEffect } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { assert } from "../../common";

type SlideInProps = {
  children?:
    | JSX.Element
    | React.FC<{
        style: React.CSSProperties;
      }>;
  from?: "top" | "bottom" | "left" | "right";
  durationInFrames?: number;
  onChange?: (props: { transform: string }) => any;
};

/**
 * @type {React.FC<SlideInProps & { [key: string]: any }>}
 */
export const SlideIn = ({
  children,
  from,
  onChange,
  ...props
}: SlideInProps) => {
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
    bottom: [height, 0],
    right: [width, 0],
    top: [-height, 0],
    left: [-width, 0]
  }[assert(from)];

  const entranceOffset = interpolate(entrance, [0, 1], outputRange);

  const wave = Math.cos(frame / Math.floor(fps / 4)) * 10 + entranceOffset;

  const transform = ["top", "bottom"].includes(assert(from))
    ? `translateY(${wave}px)`
    : `translateX(${wave}px)`;

  useEffect(() => {
    typeof onChange === "function" && onChange({ transform });
  }, [transform]);

  const Component = typeof children === "function" ? children : null;

  return children ? (
    typeof children === "function" && Component ? (
      <Component style={{ transform }} />
    ) : (
      <div className="relative" style={{ transform }}>
        {typeof children === "function" ? null : children}
      </div>
    )
  ) : null;
};

SlideIn.defaultProps = {
  from: "bottom"
};
