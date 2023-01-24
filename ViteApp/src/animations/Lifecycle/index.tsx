import classNames from "classnames/dedupe";
import React, { useCallback, useState } from "react";
import { Sequence, useVideoConfig } from "remotion";
import { assert, starts } from "../../common/utils";
import * as transformParser from "transform-parser";

type LifecycleProps = {
  children?: any;
  className?: any;
  style?: React.CSSProperties;
  Entrance?: React.FC<{
    onChange: (style: Pick<React.CSSProperties, "transform">) => any;
  }>;
  Exit?: React.FC<{
    onChange: (style: Pick<React.CSSProperties, "transform">) => any;
  }>;
  Main?: React.FC<{
    onChange: (style: Pick<React.CSSProperties, "transform">) => any;
  }>;
  duration?: number;
  ratio:
    | (`${number}:${number}:${number}` | `${number}:${number}`)
    | (string & {});
};

export const Lifecycle = ({
  className,
  Entrance,
  Exit,
  Main,
  ratio,
  children,
  duration,
  ...props
}: LifecycleProps) => {
  const stages = ratio.split(":").map((n) => Number(n));
  const total = stages.reduce((sum, n) => sum + n, 0);
  const { fps, durationInFrames } = useVideoConfig();
  duration = duration || Math.round(durationInFrames / fps);
  const entranceDuration =
    (stages.length === 3 ? stages[0] : !Entrance ? 0 : stages[0]) / total;
  const exitDuration =
    (stages.length === 3 ? stages[2] : !Exit ? 0 : stages[1]) / total;
  const mainDuration = 1 - entranceDuration - exitDuration;

  const durations = [entranceDuration, mainDuration, exitDuration].map((n) =>
    Math.round(n * fps * assert(duration))
  );
  const startPoints = starts(durations);

  const [style, setStyle] = useState<Pick<React.CSSProperties, "transform">>(
    {}
  );
  const updateStyle = useCallback(
    (s: Pick<React.CSSProperties, "transform">) => {
      setStyle({
        ...style,
        ...s,
        ...(s?.transform || style?.transform
          ? {
              transform: transformParser.stringify({
                ...(style?.transform
                  ? transformParser.parse(style?.transform)
                  : {}),
                ...(s?.transform ? transformParser.parse(s?.transform) : {})
              })
            }
          : {})
      });
    },
    []
  );

  return (
    <>
      {durations[0] && Entrance ? (
        <Sequence
          from={startPoints[0]}
          durationInFrames={durations[0]}
          layout="none"
        >
          <Entrance onChange={updateStyle}></Entrance>
        </Sequence>
      ) : null}
      {durations[1] && Main ? (
        <Sequence
          from={startPoints[1]}
          durationInFrames={durations[1]}
          layout="none"
        >
          <Main onChange={updateStyle}></Main>
        </Sequence>
      ) : null}
      {durations[2] ? (
        <Sequence
          from={startPoints[2]}
          durationInFrames={durations[2]}
          layout="none"
        >
          {typeof Exit === "function" ? (
            <Exit onChange={updateStyle}></Exit>
          ) : null}
        </Sequence>
      ) : null}
      <div
        {...props}
        className={classNames("relative", className)}
        style={{ ...props?.style, ...style }}
      >
        {children}
      </div>
    </>
  );
};

Lifecycle.defaultProps = {};
