import "./SongCreator.css";

import React, { useState } from "react";
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
 *
 * @param {object} props
 * @param {string} props.lyrics
 * @returns {JSX.Element}
 */
export const SongCreator = ({ lyrics }) => {
  const [images, setImages] = useState([]);
  const [cursor, setCursor] = useState(0);

  return (
    <div className="bg-white p-4 block w-full">
      <div className="block w-full text-right"></div>
      <div className="flex w-full">
        <div className="inline-block w-full md:w-5/12">
          <div className="p-4 sticky top-10">
            <div className="inline-block bg-gray-100 preview">
              <ImageGallery cursor={cursor} images={images} />
            </div>
            <div>
              <TimeKeeper onTick={setCursor} />
            </div>
          </div>
        </div>
        <div className="inline-block w-full md:w-7/12 p-4">
          <LyricsTabView
            defaults={{
              lyrics,
              active: "text"
            }}
            cursor={cursor}
            onSongChanged={(lines) => fetchImages(lines).then(setImages)}
          ></LyricsTabView>
        </div>
      </div>
    </div>
  );
};
