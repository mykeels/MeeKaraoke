import "./SavedFileUploader.css";

import React, { useEffect, useRef } from "react";
import classNames from "classnames";

type SavedFileUploaderProps = {
  onKaraokeFileReceived: (karaoke: {
      title: string;
      song: LyricLine;
      images: string[];
  }) => any;
  className?: any;
  /**
   * immediately opens the File Dialog when set to "open"
   */
  open?: boolean | "open";
};

export const SavedFileUploader = ({
  onKaraokeFileReceived,
  className,
  open,
  ...props
}: SavedFileUploaderProps) => {
  const grabFileURL = async (input: HTMLInputElement): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        if (!input.files) {
          throw new Error("No files found");
        }
        const file = input.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
          const text = event.target?.result?.toString();
          if (!text) {
            throw new Error("No text found in uploaded file");
          }
          resolve(text);
        });
        reader.readAsText(file);
      } catch (error) {
        reject(error);
      }
    });
  };

  const inputRef = useRef<HTMLInputElement & { alreadyOpened?: boolean }>();

  useEffect(() => {
    if (open === "open") {
      if (!inputRef.current || inputRef.current?.["alreadyOpened"]) {
        return;
      }
      inputRef.current?.click();
      inputRef.current["alreadyOpened"] = true;
    }
  }, []);

  return (
    <div
      {...props}
      className={classNames(
        "block h-screen w-screen saved-file-uploader px-16 py-8",
        className
      )}
    >
      <div className="flex w-full h-full items-center justify-center py-4 px-8 bg-purple-100 opacity-75">
        <div className="block w-full text-white">
          <div className="text-3xl py-8 text-center">
            Step 1: Upload a Karaoke File
          </div>
          <div className="py-24 text-4xl text-center">
            <div className="py-8">Click to Upload</div>
            <div className="py-8">or</div>
            <div className="py-8">Drop a File here</div>
          </div>
        </div>
      </div>
      <input
        ref={inputRef as React.MutableRefObject<HTMLInputElement>}
        type="file"
        accept=".mee.json"
        className="file-upload fixed top-0 left-0 h-screen w-screen cursor-pointer"
        onChange={(e) => {
          /** @type {HTMLInputElement} */
          const input = e.target;
          grabFileURL(input).then((text) => {
            /** @type {{ title: string, lines: LyricLine, images: string[] }} */
            const karaoke = JSON.parse(text);
            onKaraokeFileReceived({ ...karaoke, song: karaoke.lines });
          });
        }}
      />
    </div>
  );
};

SavedFileUploader.defaultProps = {
  onKaraokeFileReceived: () => {}
};
