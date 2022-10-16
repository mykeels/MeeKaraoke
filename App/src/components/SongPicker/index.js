import "./SongPicker.css";

import classNames from "classnames";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { Spinner } from "../../common";
import { DateTime } from "luxon";

/**
 * @typedef {object} SongPickerProps
 * @prop {() => Promise<SongRecord[]>} [getSongRecords]
 * @prop {(id: string) => Promise<any>} [deleteSong]
 * @prop {(song: SongRecord) => any} onSelectSong
 * @prop {() => any} onNewSong
 */

/**
 * @type {React.FC<SongPickerProps>}
 */
export const SongPicker = ({
  getSongRecords,
  deleteSong,
  onNewSong,
  onSelectSong
}) => {
  const {
    data: songRecords = [],
    isLoading,
    refetch
  } = useQuery(["song-records"], () => getSongRecords());

  const { mutate: _deleteSong } = useMutation(
    /** @param {string} id */
    async (id) => {
      if (confirm("Are you sure you want to delete this Song?")) {
        return deleteSong(id);
      }
    },
    {
      onSettled: () => refetch()
    }
  );

  return (
    <div className="block h-screen w-screen title-creator px-16 py-8">
      <div className="flex w-full h-full items-center justify-center py-4 px-8 bg-purple-200 opacity-75">
        <div className="flex w-full h-full text-white">
          <div
            className={classNames(
              "flex flex-col h-full w-5/6 py-8 px-4 overflow-auto song-picker-scroller",
              {
                "justify-center items-center ": songRecords.length <= 3
              }
            )}
          >
            {isLoading ? (
              <Spinner size={16} />
            ) : (
              songRecords.map((record, i) => (
                <div className="flex w-full" key={record.id}>
                  <button
                    key={record.id}
                    className="inline-block w-11/12 text-left bg-purple-100 bg-opacity-75 p-4 my-4 text-lg border border-purple-100 hover:border-white"
                    onClick={() => onSelectSong(record)}
                  >
                    <div className="block w-full text-right text-sm">
                      {DateTime.fromISO(record.updatedAt).toRelative()}
                    </div>
                    <div className="block w-full">
                      {i + 1}. {record.title}
                    </div>
                  </button>
                  <button
                    onClick={() => _deleteSong(record.id)}
                    className="flex w-1/12 justify-center items-center text-center my-4 mx-1 text-purple-200 bg-pink border border-pink hover:border-purple-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="flex h-full w-1/6 justify-center items-center px-2">
            <button
              className="bg-purple-100 px-4 py-4 text-lg border border-purple-100 hover:border-white"
              onClick={() => onNewSong()}
            >
              New Song
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SongPicker.defaultProps = {
  getSongRecords: async () => {
    const apiRoot = process.env.REACT_APP_API_ROOT;
    return fetch(`${apiRoot}/Songs`).then((res) => res.json());
  },
  deleteSong: async (id) => {
    const apiRoot = process.env.REACT_APP_API_ROOT;
    return fetch(`${apiRoot}/Songs/${id}`, {
      method: "delete"
    }).then((res) => res.json());
  }
};
