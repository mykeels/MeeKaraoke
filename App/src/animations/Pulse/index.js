import React from "react";
import { useCurrentFrame } from "remotion";

/**
 * @typedef {object} PulseProps
 * @property {any} children
 * @property {number} [size]
 */

/**
 * @type {React.FC<PulseProps & { [key: string]: any }>}
 */
export const Pulse = ({ children, size }) => {
  const frame = useCurrentFrame();

  const wave = 1 + size * Math.cos(frame / 15);

  const transform = `scale(${wave})`;
  return (
    <div className="relative" style={{ transform }}>
      {children}
    </div>
  );
};

Pulse.defaultProps = {
  size: 0.1
};
