import React from "react";

export const setDefaultProps = <
  P extends {},
  TDefaultProps extends Partial<P> | undefined
>(
  fn: React.FC<P>,
  defaultProps: TDefaultProps
): React.ForwardRefExoticComponent<P> => {
  const component = fn as React.ForwardRefExoticComponent<P>;
  component.defaultProps = defaultProps;
  return component;
};
