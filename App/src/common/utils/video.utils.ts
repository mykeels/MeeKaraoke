export const frames = (
  seconds: number,
  framesPerSecond = Number(
    process.env.REACT_APP_FRAMES_PER_SECOND ||
      process.env.REMOTION_FRAMES_PER_SECOND ||
      60
  )
) => Math.ceil(seconds * framesPerSecond);

/**
 * Converts frames to seconds
 */
export const f2s = (
  frames: number,
  framesPerSecond = Number(
    process.env.REACT_APP_FRAMES_PER_SECOND ||
      process.env.REMOTION_FRAMES_PER_SECOND ||
      60
  )
) => Math.ceil(frames / framesPerSecond);

export const starts = (durations: number[]) => {
  let sum = 0;
  const arr = [];
  for (let i = 0; i < durations.length; i++) {
    sum += durations[i - 1] || 0;
    arr.push(sum);
  }
  return arr;
};
