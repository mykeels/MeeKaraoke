import React from "react";

import { setDefaultProps } from "../../common";
import { SongExports } from "./SongExports";

type SongExporterScreenProps = {
  className?: any;
};

export const SongExporterScreen: React.FC<SongExporterScreenProps> = () => {
  return <SongExports />;
};

setDefaultProps(SongExporterScreen, {});
