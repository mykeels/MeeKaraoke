import React, { useEffect } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

type FadeOutProps = {
  children?: any;
  onChange: (style: Pick<React.CSSProperties, "transform" | "opacity">) => any;
};

export const FadeOut = ({ children, onChange }: FadeOutProps) => {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, durationInFrames], [1, 0]);

  useEffect(() => {
    typeof onChange === "function" && onChange({ opacity });
  }, [opacity]);

  const Component = typeof children === "function" ? children : null;

  return children ? (
    typeof children === "function" ? (
      <Component style={{ opacity }} />
    ) : (
      <div className="relative z-10" style={{ opacity }}>
        {children}
      </div>
    )
  ) : null;
};

FadeOut.defaultProps = {};
