import "./SongExporter.css";

import React, { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { Capabilities } from "./components";
import { assert, setDefaultProps, Spinner } from "../../common";
import { SongExporter } from "./SongExporter";
import { getExports, getSongRecords } from "../../common/services";

type SongExportsProps = {
  getSongRecords?: () => Promise<SongRecord[]>;
  getExports?: () => Promise<SongExport[]>;
  Capabilities?: React.FC<Pick<Parameters<typeof Capabilities>[0], "onCapabilitiesChanged">>;
  SongExporter?: React.FC<Omit<Parameters<typeof SongExporter>[0], "startExport" | "stopExport">>;
};

export const SongExports = ({
  getSongRecords,
  getExports,
  SongExporter,
  Capabilities
}: SongExportsProps) => {
  const [hasCapabilities, setHasCapabilities] = useState<boolean | null>(null);
  const { data: songRecords = [], isLoading } = useQuery(["songs"], () =>
    assert(getSongRecords, "[getSongRecords] is required")()
  );
  const { data: exports } = useQuery(
    ["exports"],
    (): Promise<Record<string, SongExport>> =>
      assert(getExports, "[getExports] is required")().then((exports) =>
        exports.reduce((dict, e) => ({ ...dict, [e.id]: e }), {})
      )
  );
  return (
    <div className="block h-screen w-screen song-exporter relative">
      <div className="flex w-full h-full items-center justify-center py-4 px-8 bg-purple-100 opacity-75"></div>
      <div className="block w-full h-full items-center justify-center py-4 px-16 absolute top-0 left-0 text-white text-sm md:text-lg overflow-auto custom-scroller">
        <div className="block w-full text-3xl py-8">
          <div className="inline-block w-3/4">Export MP4 videos</div>
          <div className="inline-block w-1/4 text-right">
            <Link to="/">❎</Link>
          </div>
        </div>
        <div className="block md:flex w-full py-4">
          {hasCapabilities ? (
            <div className="inline-block w-full px-2">
              <div className="block w-full px-8 py-4 bg-purple-200 my-4 min-h-80v">
                {isLoading ? (
                  <Spinner size={16} />
                ) : songRecords.length ? (
                  songRecords.map((record, i) =>
                    typeof SongExporter === "function" ? (
                      <SongExporter
                        duration={exports?.[record?.id]?.duration}
                        key={`${record.id}-${i}`}
                        record={record}
                        isActive={!!exports?.[record.id]}
                      />
                    ) : null
                  )
                ) : (
                  <div className="text-xl">No songs saved</div>
                )}
              </div>
            </div>
          ) : typeof Capabilities === "function" ? (
            <Capabilities
              onCapabilitiesChanged={(hasCapabilities: boolean) =>
                setHasCapabilities(hasCapabilities)
              }
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

setDefaultProps(SongExports, {
  getSongRecords,
  getExports: getExports,
  Capabilities: (props) => <Capabilities {...props} />,
  SongExporter: (props) => <SongExporter {...props} />
});
