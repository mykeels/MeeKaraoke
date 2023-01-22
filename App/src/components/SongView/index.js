import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { SongPlayer } from "../SongPlayer";

/**
 * @typedef {object} SongViewProps
 * @property {Pick<SongFileContent, "audioUrl" | "background" | "lines" | "title">} song
 * @property {any} [className]
 */

/**
 * @type {React.FC<SongViewProps & { [key: string]: any }>}
 */
export const SongView = ({ song }) => {
    /** @type {import("react").MutableRefObject<import("@remotion/player").PlayerRef>} */
    const songPlayerRef = useRef();

    useEffect(() => {
        songPlayerRef.current.getContainerNode().style.width = "100%";
        songPlayerRef.current.getContainerNode().style.height = "480px";
    }, [])
  return (
    <div className="block h-screen w-screen song-view relative">
      <div className="flex w-full h-full items-center justify-center py-4 px-8 bg-purple-100 opacity-75"></div>
      <div className="block w-full h-full items-center justify-center py-4 px-16 absolute top-0 left-0 text-white text-sm md:text-lg overflow-auto custom-scroller">
        <div className="block w-full text-3xl py-8">
          <div className="inline-block w-3/4">{song.title}</div>
          <div className="inline-block w-1/4 text-right">
            <Link to="/">❎</Link>
          </div>
        </div>
        <div className="block md:flex w-full py-4 flex-col">
          <div className="flex flex-row w-full justify-between py-4">
            <div>
              <button>Lyrics</button>
            </div>
            <div>
              <button>Style</button>
            </div>
            <div>
              <button>Export</button>
            </div>
          </div>
          <SongPlayer song={song} ref={songPlayerRef} />
        </div>
      </div>
    </div>
  );
};

SongView.defaultProps = {};
