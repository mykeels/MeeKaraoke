import React from "react";
import classNames from "classnames/dedupe";
import { AbsoluteFill } from "remotion";

type CenterFillProps = {
  className?: any;
  style?: React.CSSProperties;
  children?: any;
};

export const CenterFill = ({ children, className, style }: CenterFillProps) => {
  return (
    <AbsoluteFill
      className={classNames("items-center justify-center", className)}
      style={style}
    >
      {children}
    </AbsoluteFill>
  );
};

CenterFill.defaultProps = {};
