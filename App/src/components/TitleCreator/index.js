import "./TitleCreator.css";

import classNames from "classnames";
import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
import { debounce, uniqBy } from "lodash";

/**
 * @param {object} props
 * @param {(title: string) => Promise<{ url: string, title: string, id: string }[]>} props.getLyricsOptions
 * @returns {JSX.Element}
 */
export const TitleCreator = ({ getLyricsOptions }) => {
  const [text, setText] = useState("");
  const debouncedGetLyricsOptions = useCallback(
    debounce((text) => {
      return getLyricsOptions(text);
    }, 500),
    []
  );
  const { data: lyricsOptions = [] } = useQuery(["lyrics", text], () =>
    debouncedGetLyricsOptions(text)
  );
  return (
    <div className="block h-screen w-screen title-creator px-16 py-8">
      <div className="flex w-full h-full items-center justify-center py-4 px-8 bg-purple-200 opacity-75">
        <div className="block w-full text-white">
          <div className="text-2xl py-8 text-center">
            What do you want to Sing?
          </div>
          <div
            className={classNames("overflow-y-auto custom-scroller", {
              "h-40vh": lyricsOptions?.length,
              "h-24vh": !lyricsOptions?.length
            })}
          >
            <div className="w-full py-4">
              <input
                type="text"
                placeholder="Enter a Song Title or Author"
                className="w-full text-xl px-4 py-2 text-purple-200"
                value={text}
                onChange={(e) => setText(e?.target?.value)}
              />
            </div>
            <div className="w-full">
              {lyricsOptions?.map((option, i) => (
                <a
                  key={option.id}
                  className="block w-full bg-purple-100 bg-opacity-75 p-2 my-1 text-xs"
                  href={option.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {i + 1}. {option.title}
                </a>
              ))}
            </div>
          </div>
          <div className="text-right py-8">
            <button className="bg-purple-100 px-8 py-4 text-xl">
              Skip and Enter Lyrics Manually
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

TitleCreator.defaultProps = {
  getLyricsOptions: async (title) => {
    return title
      ? fetch(
          `https://genius.com/api/search/multi?per_page=5&q=${encodeURIComponent(
            title
          )}`
        )
          .then((res) => res.json())
          .then((data) =>
            uniqBy(
              data?.response?.sections
                ?.map((s) => s?.hits)
                ?.reduce((arr, hit) => arr.concat(hit), [])
                ?.map((hit) => hit?.result)
                ?.filter(Boolean)
                ?.map((song) => ({
                  id: song.id,
                  title: song.full_title,
                  url: song.url
                }))
                ?.filter((song) => song.title),
              (item) => item.title
            )
          )
      : Promise.resolve([]);
  }
};
