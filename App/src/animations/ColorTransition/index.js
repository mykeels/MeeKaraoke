import React, { useEffect } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/**
 *
 * @param {`#{string}`} hex
 * @returns {{ r: number, g: number, b: number } | null}
 */
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Math.floor(parseInt(result[1], 16)),
        g: Math.floor(parseInt(result[2], 16)),
        b: Math.floor(parseInt(result[3], 16))
      }
    : null;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

/**
 * @typedef {object} ColorTransitionProps
 * @property {any} children
 * @property {JSX.Element | React.FC<{ style: React.CSSProperties }>} [children]
 * @property {`#{string}`} from
 * @property {`#{string}`} to
 */

/**
 * @type {React.FC<ColorTransitionProps & { [key: string]: any }>}
 */
export const ColorTransition = ({ children, onChange, from, to }) => {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const fromRgb = hexToRgb(from);
  const toRgb = hexToRgb(to);

  const color = `#${[
    componentToHex(Math.floor(interpolate(frame, [0, durationInFrames], [fromRgb.r, toRgb.r]))),
    componentToHex(Math.floor(interpolate(frame, [0, durationInFrames], [fromRgb.g, toRgb.g]))),
    componentToHex(Math.floor(interpolate(frame, [0, durationInFrames], [fromRgb.b, toRgb.b])))
  ].join("")}`;

  useEffect(() => {
    typeof onChange === "function" && onChange({ color });
  }, [color]);

  const Component = typeof children === "function" ? children : null;

  return children ? (
    typeof children === "function" ? (
      <Component style={{ color }} />
    ) : (
      <div className="relative z-10" style={{ color }}>
        {children}
      </div>
    )
  ) : null;
};

ColorTransition.defaultProps = {};

export * from "./components";
