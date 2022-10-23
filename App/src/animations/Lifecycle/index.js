import React from "react";
import { Sequence, useVideoConfig } from "remotion";
import { starts } from "../../common/utils";

/**React.FC<{ duration: number }>
 * @typedef {object} LifecycleProps
 * @property {any} [className]
 * @property {React.FC<{ duration: number, children: any }>} [Entrance]
 * @property {React.FC<{ duration: number, children: any }>} Exit
 * @property {number} duration
 * @property {`${number}:${number}:${number}` | `${number}:${number}`} ratio
 */

/**
 * @type {React.FC<LifecycleProps & { [key: string]: any }>}
 */
export const Lifecycle = ({ Entrance, Exit, ratio, children, duration }) => {
  const stages = ratio.split(":").map((n) => Number(n));
  const total = stages.reduce((sum, n) => sum + n, 0);
  const { fps } = useVideoConfig();
  const entranceDuration =
    (stages.length === 3 ? stages[0] : !Entrance ? 0 : stages[0]) / total;
  const exitDuration =
    (stages.length === 3 ? stages[2] : !Exit ? 0 : stages[1]) / total;
  const mainDuration = 1 - entranceDuration - exitDuration;

  const startPoints = starts(
    [entranceDuration, mainDuration, exitDuration].map((n) =>
      Math.round(n * fps * duration)
    )
  );
  const durations = [entranceDuration, mainDuration, exitDuration].map((n) =>
    Math.round(n * fps * duration)
  );

  return (
    <>
      {durations[0] ? (
        <Sequence
          from={startPoints[0]}
          durationInFrames={durations[0]}
          layout="none"
        >
          <Entrance duration={durations[0] / fps}>{children}</Entrance>
        </Sequence>
      ) : null}
      <Sequence
        from={startPoints[1]}
        durationInFrames={durations[1]}
        layout="none"
      >
        <div className="relative">{children}</div>
      </Sequence>
      {durations[2] ? (
        <Sequence
          from={startPoints[2]}
          durationInFrames={durations[2]}
          layout="none"
        >
          <Exit duration={durations[2] / fps}>{children}</Exit>
        </Sequence>
      ) : null}
    </>
  );
};

Lifecycle.defaultProps = {};
