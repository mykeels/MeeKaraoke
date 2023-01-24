export const isFrameWithin = (
  frame: number,
  from: number,
  duration: number
) => {
  const to = from + duration;

  if (from <= frame && frame <= to) {
    return frame - from;
  }
};
