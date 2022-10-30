import React from "react";
import { useParams } from "react-router-dom";
import { SongExporter } from "./SongExporter";

/**
 * @typedef {object} SongExporterScreenProps
 * @property {any} [className]
 */

/**
 * @type {React.FC<SongExporterScreenProps & { [key: string]: any }>}
 */
export const SongExporterScreen = () => {
  const { id } = useParams();
  return <SongExporter id={id} />;
};

SongExporterScreen.defaultProps = {};
