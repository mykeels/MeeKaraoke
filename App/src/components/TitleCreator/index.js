import "./TitleCreator.css";

import classNames from "classnames";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { uniqBy } from "lodash";
import * as cheerio from "cheerio";
import { Spinner } from "../../common";

/**
 * @template TValue
 * @param {TValue} value
 * @param {number} [delay]
 * @returns {TValue}
 */
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * @param {object} props
 * @param {(title: string) => Promise<{ url: string, title: string, id: string }[]>} props.getLyricsOptions
 * @param {(url: string) => Promise<string>} props.getLyrics
 * @param {(data: { title: string, lyrics: string }) => any} [props.onTitleChanged]
 * @param {() => any} [props.onSkip]
 * @returns {JSX.Element}
 */
export const TitleCreator = ({
  getLyricsOptions,
  getLyrics,
  onTitleChanged,
  onSkip
}) => {
  /** @type {ReactState<string>} */
  const [text, setText] = useState("");
  /** @type {ReactState<{ url: string, title: string, id: string }>} */
  const [selected, setSelected] = useState(null);
  const debouncedText = useDebounce(text, 500);
  const { data: lyricsOptions = [], isLoading } = useQuery(
    ["lyric-options", debouncedText],
    () => getLyricsOptions(debouncedText)
  );

  const { mutate: _getLyrics, isLoading: isLyricsLoading } = useMutation(
    /** @param {{ url: string, title: string, id: string }} props */
    ({ url }) => getLyrics(url),
    {
      onSettled: (lyrics, error, props) => {
        if (!error) {
          onTitleChanged({
            title: props?.title,
            lyrics
          });
        }
      }
    }
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
              {isLoading ? (
                <div className="w-full text-center">
                  <Spinner size={15} />
                </div>
              ) : (
                lyricsOptions?.map((option, i) => (
                  <button
                    key={option.id}
                    className="block w-full bg-purple-100 bg-opacity-75 p-2 my-1 text-xs"
                    onClick={() => {
                      setSelected(option);
                      _getLyrics(option);
                    }}
                  >
                    {i + 1}. {option.title}
                    {isLyricsLoading && selected?.url === option.url ? (
                      <Spinner size={12} />
                    ) : null}
                  </button>
                ))
              )}
            </div>
          </div>
          <div className="text-right py-8">
            <button
              className="bg-purple-100 px-8 py-4 text-xl"
              onClick={() => onSkip()}
            >
              Skip and Enter Lyrics Manually
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

TitleCreator.defaultProps = {
  onSkip: () => {},
  onTitleChanged: () => {},
  getLyricsOptions: async (title) => {
    if (!title) {
      return [];
    }
    return fetch(
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
      );
  },
  getLyrics: async (url) => {
    return fetch(url)
      .then((res) => res.text())
      .then((html) => {
        const $ = cheerio.load(html);
        const lyrics = $('[data-lyrics-container="true"]')
          .html()
          .replace(/<br>/g, "\n");
        return cheerio.load(lyrics).root().text();
      });
  }
};
