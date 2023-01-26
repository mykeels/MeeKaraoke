import React, { useEffect } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { assert, setDefaultProps } from "../../common";

type ZoomOutProps = {
  children?: any;
  size?: number;
  onChange?: (props: { transform: string }) => any;
};

export const ZoomOut = ({ children, size, onChange }: ZoomOutProps) => {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const zoom = 1 - interpolate(frame, [0, durationInFrames], [0, assert(size)]);

  const transform = `scale(${zoom})`;

  useEffect(() => {
    typeof onChange === "function" && onChange({ transform });
  }, [transform]);

  const Component = typeof children === "function" ? children : null;

  return children ? (
    typeof children === "function" ? (
      <Component style={{ transform }} />
    ) : (
      <div className="relative z-10" style={{ transform }}>
        {children}
      </div>
    )
  ) : null;
};

setDefaultProps(ZoomOut, {
  size: 0.1
});
