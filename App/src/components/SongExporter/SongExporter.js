import "./SongExporter.css";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getSongById, getSystemCapabilities } from "../../common/services";
import {
  FfMpegInstructions,
  NodeJSInstructions
} from "./components/Instructions";
import { frames, Spinner } from "../../common";

/**
 * @typedef {object} SongExporterProps
 * @property {string} id
 * @property {() => Promise<import("../../common/services").SystemCapabilities>} [getCapabilities]
 * @property {(id: string) => Promise<SongFileContent>} [getSongById]
 */

/**
 * @type {React.FC<SongExporterProps & { [key: string]: any }>}
 */
export const SongExporter = ({ id, getCapabilities, getSongById }) => {
  const { data: capabilities } = useQuery(["capabilities"], getCapabilities);
  const { data: song } = useQuery(["songs", id], () => getSongById(id));
  const [outputs, setOutputs] = useState([]);
  /** @type {ReactState<string>} */
  const [filepath, setFilepath] = useState("");
  /** @type {ReactState<{ encoded: number, rendered: number, frames: number, audio: boolean, complete: boolean }>} */
  const [status, setStatus] = useState({
    encoded: 0,
    rendered: 0,
    frames: 0,
    audio: false,
    complete: false
  });

  useEffect(() => {
    if (song) {
      setStatus((status) => ({ ...status, frames: frames(song.duration + 3) }));
    }
  }, [song?.duration]);

  useEffect(() => {
    if (capabilities?.ffmpeg && capabilities?.nodeJS && song) {
      const apiRootUrl = process.env.REACT_APP_API_ROOT;
      const evtSource = new EventSource(
        `${apiRootUrl}/songs/${id}/build-video`
      );
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
    }
  }, [capabilities?.ffmpeg, capabilities?.nodeJS, song?.id]);

  return (
    <div className="block h-screen w-screen song-exporter relative">
      <div className="flex w-full h-full items-center justify-center py-4 px-8 bg-purple-100 opacity-75"></div>
      <div className="block w-full h-full items-center justify-center py-4 px-16 absolute top-0 left-0 text-white text-sm md:text-lg">
        <div className="block w-full text-3xl py-8">
          <div className="inline-block w-3/4">
            Export &quot;{song?.title}&quot;
          </div>
          <div className="inline-block w-1/4 text-right">
            <Link to="/">❎</Link>
          </div>
        </div>
        <div className="block md:flex w-full py-4">
          <div className="inline-block w-full md:w-1/4 px-2">
            <div className="block w-full px-4 py-2 bg-purple-200 my-4">
              1. Checking NodeJS is installed{" "}
              {capabilities?.nodeJS ? "✅" : "❌"}
            </div>

            <div className="block w-full px-4 py-2 bg-purple-200 my-4">
              2. Checking FFMpeg is installed{" "}
              {capabilities?.ffmpeg ? "✅" : "❌"}
            </div>

            <div className="block w-full px-4 py-2 bg-purple-200 my-4">
              3. Rendering Video{" "}
              {capabilities?.nodeJS && capabilities?.ffmpeg ? (
                status.complete ? (
                  "✅"
                ) : (
                  <Spinner size={16} />
                )
              ) : null}
            </div>
          </div>
          <div className="inline-block w-full md:w-3/4 px-2">
            <div className="block w-full px-8 py-4 bg-black my-4 h-80v overflow-auto custom-scroller">
              {!capabilities?.nodeJS ? (
                <NodeJSInstructions />
              ) : !capabilities?.ffmpeg ? (
                <FfMpegInstructions />
              ) : (
                <div>
                  <div className="text-pink font-bold">
                    {filepath ? (
                      <div className="py-2">Output: {filepath}</div>
                    ) : null}
                    {status?.complete ? (
                      <div className="py-2">Rendering Video Complete: ✅</div>
                    ) : null}
                    {status?.encoded || status?.rendered ? (
                      <div className="py-2">
                        Encoded: {status?.encoded} / {status?.frames}, Rendered:{" "}
                        {status?.rendered} / {status?.frames}
                      </div>
                    ) : null}
                  </div>
                  {outputs.map((output, i) => (
                    <p key={`${output.slice(0, 32)}-${i}`} className="py-2">
                      {output}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SongExporter.defaultProps = {
  getCapabilities: getSystemCapabilities,
  getSongById
};
