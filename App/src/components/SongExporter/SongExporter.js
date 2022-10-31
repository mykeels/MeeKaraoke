import "./SongExporter.css";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import { frames, Spinner } from "../../common";
import { getSongById } from "../../common/services";

/**
 * @typedef {object} SongExporterProps
 * @property {SongRecord} record
 * @property {number} [duration]
 * @property {(id: string) => Promise<SongFileContent>} [getSongById]
 * @property {(id: string) => EventSource} [startExport]
 * @property {(id: string) => Promise<void>} [stopExport]
 * @property {boolean} isActive
 */

/**
 * @type {React.FC<SongExporterProps & { [key: string]: any }>}
 */
export const SongExporter = ({
  record,
  duration,
  startExport,
  stopExport,
  getSongById,
  isActive
}) => {
  const [outputs, setOutputs] = useState([]);
  /** @type {ReactState<string>} */
  const [filepath, setFilepath] = useState("");
  /** @type {ReactState<{ encoded: number, rendered: number, frames: number, audio: boolean, complete: boolean }>} */
  const [status, setStatus] = useState({
    encoded: 0,
    rendered: 0,
    frames: frames(duration),
    audio: false,
    complete: false
  });
  const [isExporting, setIsExporting] = useState(isActive);
  /** @type {ReactState<EventSource>} */
  const [eventSource, setEventSource] = useState(null);

  const start = async () => {
    setIsExporting(true);
    const song = await getSongById(record.id);
    setStatus((status) => ({ ...status, frames: frames(song.duration) }));
    const evtSource = startExport(record.id);
    setEventSource(evtSource);
    evtSource.onmessage = function (event) {
      /** @type {{ output: string }} */
      var data = JSON.parse(event.data);
      if (
        ["encoded", "rendered"].every((chunk) => data?.output.includes(chunk))
      ) {
        const finds = data.output.match(/(\d+) rendered, (\d+) encoded/);
        const rendered = Number(finds[1]);
        const encoded = Number(finds[2]);
        if (rendered && encoded) {
          setStatus((status) => ({ ...status, rendered, encoded }));
        }
      } else if (data?.output?.includes("exit")) {
        evtSource.close();
      } else if (data?.output?.includes("Output Filepath:")) {
        setFilepath(data.output.replace("Output Filepath: ", ""));
      } else if (data?.output?.includes("Muxing audio")) {
        setStatus((status) => ({ ...status, audio: true }));
      } else if (
        ["Rendered in ", "Encoded in "].some((chunk) =>
          data?.output?.includes(chunk)
        )
      ) {
        if (data.output.includes("Encoded in ")) {
          setStatus((status) => ({ ...status, complete: true }));
        }
      } else {
        setOutputs((outputs) => [data?.output, ...outputs]);
      }
    };
  };
  const { mutate: stop, isLoading: isStopLoading } = useMutation(
    () => stopExport(record.id),
    {
      onSuccess: () => {
        setIsExporting(false);
        eventSource.close();
        setEventSource(null);
      }
    }
  );

  return (
    <div className="block w-full py-4">
      <div className="flex w-full">
        <Link
          to={`/create/${record.id}`}
          className="flex md:inline-block w-10/12 text-left bg-purple-100 bg-opacity-75 p-4 border border-purple-100 hover:border-white"
        >
          <div className="block w-full text-sm md:text-lg">{record.title}</div>
        </Link>
        {isExporting ? (
          <button
            onClick={() => stop()}
            className="flex w-1/4 justify-center items-center text-center px-4 ml-1 bg-black border border-black hover:border-white text-white"
          >
            {isStopLoading ? <Spinner size={16} /> : "Stop"}
          </button>
        ) : (
          <button
            onClick={() => start()}
            className="flex w-1/4 justify-center items-center text-center px-4 ml-1 text-purple-200 bg-pink border border-pink hover:border-purple-100"
          >
            Export
          </button>
        )}
      </div>
      {isExporting ? (
        <div className="block w-full bg-black p-2 my-2">
          <div className="block w-full text-pink font-bold">
            {filepath ? <div className="py-2">Output: {filepath}</div> : null}
            {status?.complete ? (
              <div className="py-2">Rendering Video Complete: ✅</div>
            ) : null}
            {status?.encoded ? (
              <div className="flex w-full justify-center items-center py-2">
                <span className="inline-block w-1/4">Encoded:</span>{" "}
                <progress
                  className="inline-block w-3/4"
                  value={status.encoded}
                  max={status.frames}
                >
                  {status.encoded} %
                </progress>
              </div>
            ) : null}
            {status?.rendered ? (
              <div className="flex w-full justify-center items-center py-2">
                <span className="inline-block w-1/4">Rendered:</span>{" "}
                <progress
                  className="inline-block w-3/4"
                  value={status.rendered}
                  max={status.frames}
                >
                  {status.rendered} %
                </progress>
              </div>
            ) : null}
          </div>
          {outputs.map((output, i) => (
            <p
              key={`${output.slice(0, 32)}-${i}`}
              className="block w-full py-2"
            >
              {output}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
};

SongExporter.defaultProps = {
  startExport: (id) => {
    const apiRootUrl = process.env.REACT_APP_API_ROOT;
    return new EventSource(`${apiRootUrl}/video-builds/${id}/start`);
  },
  stopExport: async (id) => {
    const apiRootUrl = process.env.REACT_APP_API_ROOT;
    return fetch(`${apiRootUrl}/video-builds/${id}`, {
      method: "delete"
    }).then(() => {});
  },
  getSongById,
  isActive: false,
  duration: 1
};
