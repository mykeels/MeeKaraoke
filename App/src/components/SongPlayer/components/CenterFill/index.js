import React from "react";
import classNames from "classnames/dedupe";
import { AbsoluteFill } from "remotion";

/**
 * @typedef {object} CenterFillProps
 * @property {any} [className]
 * @property {any} children
 */

/**
 * @type {React.FC<CenterFillProps & { [key: string]: any }>}
 */
export const CenterFill = ({ children, className }) => {
  return (
    <AbsoluteFill
      className={classNames("bg-pink items-center justify-center", className)}
    >
      {children}
    </AbsoluteFill>
  );
};

CenterFill.defaultProps = {};
