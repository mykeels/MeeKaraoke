import React, { useEffect } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { assert, setDefaultProps } from "../../common";

type PulseProps = {
  children?: any;
  size?: number;
  onChange?: (props: { transform: string }) => any;
};

export const Pulse = ({ children, size, onChange }: PulseProps) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const wave = 1 + assert(size) * Math.sin(frame / Math.floor(fps / 4));

  const transform = `scale(${wave})`;

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

setDefaultProps(Pulse, {
  size: 0.1
});
