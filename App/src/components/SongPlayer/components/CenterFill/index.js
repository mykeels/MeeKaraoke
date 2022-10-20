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
    <AbsoluteFill className="bg-gray-100 items-center justify-center">
      {children}
    </AbsoluteFill>
  );
};

CenterFill.defaultProps = {};
