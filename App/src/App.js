import React, { useState } from "react";
import { SongCreator, SongUploader, TitleCreator } from "./components";
import { SavedFileUploader } from "./components/SavedFileUploader";
import { LyricsTabView } from "./components/SongCreator/components/LyricsTabView";
import { SongPicker } from "./components/SongPicker";

/** @param {SongRecord} record */
async function getSongFileContents(record) {
  const apiRoot = process.env.REACT_APP_API_ROOT;
  /** @type {SongFileContent} */
  const song = await fetch(record.songFilePath.replace("~", apiRoot)).then(
    (res) => res.json()
  );
  song["song"] = song["lines"] || song["song"];
  song.audioUrl = await getAudioUrl(record);
  song.lyrics = song.song.map((l) => l.text).join("\n");
  return song;
}

/** @param {SongRecord} record */
async function getAudioUrl(record) {
  const apiRoot = process.env.REACT_APP_API_ROOT;
  return fetch(record.audioFilePath.replace("~", apiRoot))
    .then((res) => res.blob())
    .then((blob) => URL.createObjectURL(blob));
}

/** @type {React.FC<{}>} */
export const App = () => {
  /** @type {ReactState<number>} */
  const [stage, setStage] = useState(0);
  /** @type {ReactState<SongFileContent>} */
  const [state, setState] = useState(null);
  /** @type {ReactState<boolean | "open">} */
  const [isFileUploadActive, setIsFileUploadActive] = useState(false);
  const selectSong = async (record) => {
    const song = await getSongFileContents(record);
    setState(song);
    setStage(3);
  };
  return (
    <div
      className="block overflow-auto custom-scroller h-screen"
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
          setIsFileUploadActive(true);
        } else if (e.type === "dragleave") {
          setIsFileUploadActive(false);
        }
      }}
      onDrop={() => {}}
    >
      {isFileUploadActive ? (
        <SavedFileUploader
          className="fixed top-0 left-0 z-10"
          open={isFileUploadActive}
          onKaraokeFileReceived={(karaoke) => {
            setIsFileUploadActive(false);
            setState({
              ...state,
              ...karaoke,
              audioUrl: null,
              title: karaoke.title || "karaoke",
              lyrics: karaoke.song.map((l) => l.text).join("\n")
            });
            setStage(2);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFileUploadActive(false);
          }}
        />
      ) : null}
      {stage === 0 ? (
        <SongPicker
          onNewSong={() => setStage(stage + 1)}
          onSelectSong={selectSong}
        />
      ) : stage === 1 ? (
        <TitleCreator
          onFileUploadIntent={() => setIsFileUploadActive("open")}
          onTitleChanged={(data) => {
            setState((state) => ({ ...state, ...data }));
            setStage(stage + 1);
          }}
        />
      ) : stage === 2 ? (
        <SongUploader
          onAudioFileReceived={(audioUrl) => {
            setState((state) => ({ ...state, audioUrl }));
            setStage(stage + 1);
          }}
        />
      ) : (
        <SongCreator
          title={state.title}
          url={state.audioUrl}
          onReset={() => {
            setState(null);
            setStage(0);
          }}
          defaults={{
            song: state?.song,
            images: state?.images
          }}
          LyricsTabView={(props) => (
            <LyricsTabView
              {...props}
              defaults={{
                active: "pretty",
                text: state.lyrics
              }}
            />
          )}
        />
      )}
    </div>
  );
};
