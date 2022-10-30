import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";

import { SongExporter } from "./";

export default {
  title: "components/SongExporter",
  component: SongExporter,
  decorators: []
};

const queryClient = new QueryClient();

/** @type {React.FC<import("./SongExporter").SongExporterProps>} */
const SongExporterComponent = (props) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <SongExporter
        getCapabilities={async () => ({ nodeJS: "14.16.0" })}
        getSongById={async () => ({
          id: "1",
          title: "Something just like this"
        })}
        {...props}
      />
    </BrowserRouter>
  </QueryClientProvider>
);

export const NoNodeJs = () => (
  <SongExporterComponent
    getCapabilities={async () => ({ nodeJS: false, ffmpeg: false })}
  />
);

export const NoFfMpeg = () => (
  <SongExporterComponent
    getCapabilities={async () => ({ nodeJS: true, ffmpeg: false })}
  />
);
