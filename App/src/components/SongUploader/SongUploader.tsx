import "./SongUploader.css";

import React from "react";
import { YoutubeDownloader } from "./components";
import { useQuery } from "react-query";
import classNames from "classnames";
import { getAudioUrl, getSystemCapabilities } from "../../common/services";
import { assert, setDefaultProps } from "../../common";

const grabFileURL = async (input: HTMLInputElement): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      if (!input.files) {
        throw new Error("No files found");
      }
      const file = input.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        const result = event.target?.result;
        if (!result) {
          throw new Error("No audio found in uploaded file");
        }
        const blob = new Blob([result]);
        const url = URL.createObjectURL(blob);
        resolve(url);
      });
      reader.readAsArrayBuffer(file);
    } catch (error) {
      reject(error);
    }
  });
};

type SongUploaderProps = {
  onAudioFileReceived: (blobUrl: string) => any;
  className?: any;
  title?: string;
  getCapabilities?: () => Promise<{
    nodeJS: string;
  }>;
  AudioDownloader?: React.FC<{
    [key: string]: any;
    onDownload: (url: string) => any;
  }>;
};

export const SongUploader = ({
  title,
  onAudioFileReceived,
  getCapabilities,
  AudioDownloader
}: SongUploaderProps) => {
  const { data: capabilities } = useQuery(
    ["capabilities"],
    assert(getCapabilities, "getCapabilities is required")
  );
  return (
    <div className="block h-screen w-screen song-uploader px-16 py-8 relative">
      <div className="flex w-full h-full items-center justify-center py-4 px-8 bg-purple-100 opacity-75"></div>
      <div className="flex w-full h-full items-center justify-center py-4 px-16 absolute top-0 left-0">
        <div className="block w-full text-white">
          <div className="text-3xl py-8 text-center">
            Step 2: Choose the audio{title ? ` for ${title}` : null}
          </div>
          <div className="block p-8 text-xl">
            {capabilities?.nodeJS ? (
              typeof AudioDownloader === "function" ? (
                <AudioDownloader
                  className="inline-block w-full lg:w-1/2 lg:text-center"
                  onDownload={onAudioFileReceived}
                />
              ) : null
            ) : null}
            <div
              className={classNames("inline-block w-full lg:text-center", {
                "lg:w-1/2": capabilities?.nodeJS
              })}
            >
              <div className="py-4">From File</div>
              <div className="px-8">
                <div className="py-2 px-4 leading-tight bg-lavender-100 relative text-center">
                  <input
                    type="file"
                    accept=".mp3, .ogg, .wav, .webm"
                    className="opacity-0 cursor-pointer block absolute top-0 left-0 h-full w-full"
                    onChange={(e) => {
                      /** @type {HTMLInputElement} */
                      const input = e.target;
                      grabFileURL(input).then(onAudioFileReceived);
                    }}
                  />
                  Upload a File
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

setDefaultProps(SongUploader, {
  onAudioFileReceived: () => {},
  getCapabilities: getSystemCapabilities,
  AudioDownloader: (props) => (
    <YoutubeDownloader
      {...props}
      getAudioUrl={(youtubeUrl) =>
        getAudioUrl(youtubeUrl).then((res) => res.url)
      }
    />
  )
});
