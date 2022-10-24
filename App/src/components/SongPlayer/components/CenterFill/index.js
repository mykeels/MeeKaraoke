import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * @typedef {object} CenterFillProps
 * @property {any} children
 */

/**
 * @type {React.FC<CenterFillProps & { [key: string]: any }>}
 */
export const CenterFill = ({ children }) => {
  return (
    <AbsoluteFill className="bg-pink items-center justify-center">
      {children}
    </AbsoluteFill>
  );
};

CenterFill.defaultProps = {};
