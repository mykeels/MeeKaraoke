import React, { useEffect } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { assert, setDefaultProps } from "../../common";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Math.floor(parseInt(result[1], 16)),
        g: Math.floor(parseInt(result[2], 16)),
        b: Math.floor(parseInt(result[3], 16))
      }
    : null;
}

function numToHex(n: number): string {
  var hex = n.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

type ColorTransitionProps = {
  children?:
    | ((props: { style: { color: string } }) => (JSX.Element | null))
    | JSX.Element;
  from: string;
  to: string;
  onChange?: (props: { color: string }) => void;
};

export const ColorTransition = ({
  children,
  onChange,
  from,
  to
}: ColorTransitionProps) => {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const fromRgb = assert(hexToRgb(from));
  const toRgb = assert(hexToRgb(to));

  const color = `#${[
    numToHex(
      Math.floor(
        interpolate(frame, [0, durationInFrames], [fromRgb.r, toRgb.r])
      )
    ),
    numToHex(
      Math.floor(
        interpolate(frame, [0, durationInFrames], [fromRgb.g, toRgb.g])
      )
    ),
    numToHex(
      Math.floor(
        interpolate(frame, [0, durationInFrames], [fromRgb.b, toRgb.b])
      )
    )
  ].join("")}`;

  useEffect(() => {
    typeof onChange === "function" && onChange({ color });
  }, [color]);

  const Component = typeof children === "function" ? assert(children) : null;

  return children ? (
    typeof children === "function" && Component ? (
      <Component style={{ color }} />
    ) : (
      <div className="relative z-10" style={{ color }}>
        {typeof children === "function" ? null : children}
      </div>
    )
  ) : null;
};

setDefaultProps(ColorTransition, {});

export * from "./components";
