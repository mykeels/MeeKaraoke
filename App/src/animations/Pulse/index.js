import React, { useEffect } from "react";
import { useCurrentFrame } from "remotion";

/**
 * @typedef {object} PulseProps
 * @property {any} children
 * @property {number} [size]
 * @property {(style: React.CSSProperties) => any} [onChange]
 */

/**
 * @type {React.FC<PulseProps & { [key: string]: any }>}
 */
export const Pulse = ({ children, size, onChange }) => {
  const frame = useCurrentFrame();

  const wave = 1 + size * Math.sin(frame / 15);

  const transform = `scale(${wave})`;

  useEffect(() => {
    typeof onChange === "function" && onChange({ transform });
  }, [transform]);
  useEffect(() => {
    return () => {
      typeof onChange === "function" && onChange(null);
    };
  }, []);

  const Component = children;

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

Pulse.defaultProps = {
  size: 0.1
};
