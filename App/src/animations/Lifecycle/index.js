import React, { useState } from "react";
import { Sequence, useVideoConfig } from "remotion";
import { starts } from "../../common/utils";

/**React.FC<{ duration: number }>
 * @typedef {object} LifecycleProps
 * @property {any} [className]
 * @property {React.FC<{ onChange: (style: React.CSSProperties) => any }>} [Entrance]
 * @property {React.FC<{ onChange: (style: React.CSSProperties) => any }>} [Exit]
 * @property {React.FC<{ onChange: (style: React.CSSProperties) => any }>} [Main]
 * @property {number} duration
 * @property {(`${number}:${number}:${number}` | `${number}:${number}`) | (string & {})} ratio
 */

/**
 * @type {React.FC<LifecycleProps & { [key: string]: any }>}
 */
export const Lifecycle = ({
  Entrance,
  Exit,
  Main,
  ratio,
  children,
  duration
}) => {
  const stages = ratio.split(":").map((n) => Number(n));
  const total = stages.reduce((sum, n) => sum + n, 0);
  const { fps } = useVideoConfig();
  const entranceDuration =
    (stages.length === 3 ? stages[0] : !Entrance ? 0 : stages[0]) / total;
  const exitDuration =
    (stages.length === 3 ? stages[2] : !Exit ? 0 : stages[1]) / total;
  const mainDuration = 1 - entranceDuration - exitDuration;

  const durations = [entranceDuration, mainDuration, exitDuration].map((n) =>
    Math.round(n * fps * duration)
  );
  const startPoints = starts(durations);

  const [style, setStyle] = useState({});

  return (
    <>
      {durations[0] && Entrance ? (
        <Sequence
          from={startPoints[0]}
          durationInFrames={durations[0]}
          layout="none"
        >
          <Entrance onChange={(s) => setStyle(s)}></Entrance>
        </Sequence>
      ) : null}
      {durations[1] && Main ? (
        <Sequence
          from={startPoints[1]}
          durationInFrames={durations[1]}
          layout="none"
        >
          <Main onChange={(s) => setStyle(s)}></Main>
        </Sequence>
      ) : null}
      {durations[2] ? (
        <Sequence
          from={startPoints[2]}
          durationInFrames={durations[2]}
          layout="none"
        >
          <Exit onChange={(s) => setStyle(s)}></Exit>
        </Sequence>
      ) : null}
      <div className="relative" style={style}>
        {children}
      </div>
    </>
  );
};

Lifecycle.defaultProps = {};
