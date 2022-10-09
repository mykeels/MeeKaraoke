import "./SongCreator.css";

import React, { useEffect, useRef, useState } from "react";
import { LyricsTabView } from "./components/LyricsTabView";
import axios from "axios";
import rake from "rake-js";
import { TimeKeeper } from "./components/TimeKeeper";
import { ImageGallery } from "./components/ImageGallery";

/** @param {Song} lines */
const fetchImages = async (lines, intervals = 5) => {
  let cursor = intervals;
  let texts = [];
  const keywords = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isWithinBounds =
      cursor - intervals <= line.from && cursor >= line.from + line.duration;
    if (isWithinBounds) {
      texts.push(line.text);
    } else {
      cursor += intervals;
      keywords.push(rake(texts.join("\n"), { language: "english" }).join(" "));
      texts = [line.text];
    }
  }
  return Promise.all(
    keywords.map((keyword) =>
      axios
        .get(`https://source.unsplash.com/random/640x480/?${keyword}`, {
          maxRedirects: 0
        })
        .then((res) => res.request.responseURL)
    )
  );
};

/**
 * @param {Song} song
 * @param {number} cursor
 */
const getCurrentLine = (song, cursor) => {
  return song.find(
    (line) => cursor > line.from && cursor <= line.from + line.duration
  );
};

/**
 *
 * @param {object} props
 * @param {string} props.text
 * @returns {JSX.Element}
 */
export const SongCreator = ({ text }) => {
  /** @type {ReactState<Song>} */
  const [song, setSong] = useState([]);
  /** @type {ReactState<string[]>} */
  const [images, setImages] = useState([]);
  /** @type {ReactState<number>} */
  const [cursor, setCursor] = useState(0);
  /** @type {import("react").MutableRefObject<HTMLAudioElement>} */
  const audioRef = useRef();
  const currentLine = getCurrentLine(song, cursor) || {
    text: "I've been reading books of old, The legends and the myths, Achilles and his Gold",
    duration: 0,
    from: 0,
    imageURL: ""
  };

  useEffect(() => {
    fetchImages(song).then(setImages);
  }, [song]);

  return (
    <div className="bg-white p-4 block w-full">
      <div className="block w-full text-right"></div>
      <div className="flex w-full">
        <div className="inline-block w-full md:w-5/12">
          <div className="p-4 sticky top-10">
            <audio ref={audioRef}>
              <source
                src="./sounds/something-just-like-this.mp3"
                type="audio/mpeg"
              />
            </audio>
            <ImageGallery cursor={cursor} images={images} line={currentLine} />
            <div>
              <TimeKeeper
                onTick={setCursor}
                onStart={() => audioRef.current.play()}
                onStop={() => {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                }}
              />
            </div>
          </div>
        </div>
        <div className="inline-block w-full md:w-7/12 p-4">
          <LyricsTabView
            defaults={{
              text,
              active: "text"
            }}
            cursor={cursor}
            song={song}
            onSongChanged={setSong}
          ></LyricsTabView>
        </div>
      </div>
    </div>
  );
};
