import "./SongUploader.css";

import React from "react";

/**
 * @typedef {object} SongUploaderProps
 * @property {(blobUrl: string) => any} onAudioFileReceived
 * @property {any} [className]
 */

/**
 * @type {React.FC<SongUploaderProps & { [key: string]: any }>}
 */
export const SongUploader = ({ onAudioFileReceived }) => {
  /**
   * @param {HTMLInputElement} input
   * @returns {Promise<string>}
   */
  const grabFileURL = async (input) => {
    return new Promise((resolve, reject) => {
      try {
        const file = input.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
          const blob = new Blob([event.target.result]);
          const url = URL.createObjectURL(blob);
          resolve(url);
        });
        reader.readAsArrayBuffer(file);
      } catch (error) {
        reject(error);
      }
    });
  };
  return (
    <div className="block h-screen w-screen song-uploader px-16 py-8">
      <div className="flex w-full h-full items-center justify-center py-4 px-8 bg-purple-100 opacity-75">
        <div className="block w-full text-white">
          <div className="text-3xl py-8 text-center">Step 2: Upload an MP3 File</div>
          <div className="py-24 text-4xl text-center">
            <div className="py-8">Click to Upload</div>
            <div className="py-8">or</div>
            <div className="py-8">Drop a File here</div>
          </div>
        </div>
      </div>
      <input
        type="file"
        accept=".mp3, .ogg, .wav, .webm"
        className="file-upload fixed top-0 left-0 h-screen w-screen cursor-pointer"
        onChange={(e) => {
          /** @type {HTMLInputElement} */
          const input = e.target;
          grabFileURL(input).then(onAudioFileReceived);
        }}
      />
    </div>
  );
};

SongUploader.defaultProps = {
  onAudioFileReceived: () => {}
};
