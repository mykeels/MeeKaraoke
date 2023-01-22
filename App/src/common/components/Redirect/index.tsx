import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type RedirectProps = {
  to: string
}

export const Redirect = ({ to }: RedirectProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  }, []);
  return <div></div>;
};

Redirect.defaultProps = {};
