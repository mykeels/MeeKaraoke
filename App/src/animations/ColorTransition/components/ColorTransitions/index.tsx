import React from "react";
import { Sequence, useVideoConfig } from "remotion";
import { ColorTransition } from "../..";
import { assert, f2s, frames } from "../../../../common";

type ColorTransitionsProps = {
  children?:
    | ((props: { style: { color: string } }) => (JSX.Element | null))
    | JSX.Element;
  colors: string[];
  transitionDuration?: number;
};

export const ColorTransitions = ({
  children,
  colors,
  transitionDuration
}: ColorTransitionsProps) => {
  const { durationInFrames } = useVideoConfig();
  const durationInSeconds = f2s(durationInFrames);
  const imageCount = Math.ceil(durationInSeconds / assert(transitionDuration));
  const repeatedColors = new Array(imageCount).fill(0).map((_, i) => ({
    from: colors[i % colors.length],
    to: colors[(i + 1) % colors.length]
  }));

  const Component = typeof children === "function" ? children : null;

  return (
    <>
      {repeatedColors.map((color, i) => (
        <Sequence
          key={`${color.from}-${color.to}-${i}`}
          from={i * frames(assert(transitionDuration))}
          durationInFrames={frames(assert(transitionDuration))}
          layout="none"
        >
          <ColorTransition from={color.from} to={color.to}>
            {({ style }) =>
              children ? (
                typeof children === "function" && Component ? (
                  <Component style={{ color: style.color }} />
                ) : (
                  <div className="relative z-10" style={{ color: style.color }}>
                    {typeof children === "function" ? null : children}
                  </div>
                )
              ) : null
            }
          </ColorTransition>
        </Sequence>
      ))}
    </>
  );
};

ColorTransitions.defaultProps = {
  transitionDuration: 5
};
