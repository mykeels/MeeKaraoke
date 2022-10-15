import React, { useState } from "react";
import { SongCreator, SongUploader, TitleCreator } from "./components";
import { SavedFileUploader } from "./components/SavedFileUploader";
import { LyricsTabView } from "./components/SongCreator/components/LyricsTabView";

/** @type {React.FC<{}>} */
export const App = () => {
  /** @type {ReactState<number>} */
  const [stage, setStage] = useState(0);
  /** @type {ReactState<{ title: string, lyrics: string, audioUrl: string, images: string[], song: Song }>} */
  const [state, setState] = useState(null);
  /** @type {ReactState<boolean | "open">} */
  const [isFileUploadActive, setIsFileUploadActive] = useState(false);
  console.log(state);
  return (
    <div
      className="block overflow-auto custom-scroller h-screen"
      onDragEnter={(e) => {
        console.log(e.type);
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
          open={isFileUploadActive}
          onKaraokeFileReceived={(karaoke) => {
            console.log(karaoke);
            setIsFileUploadActive(false);
            setState({
              ...karaoke,
              audioUrl: null,
              title: "Uploaded File",
              lyrics: karaoke.song.map((l) => l.text).join("\n")
            });
            setStage(1);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFileUploadActive(false);
          }}
        />
      ) : null}
      {stage === 0 ? (
        <TitleCreator
          onFileUploadIntent={() => setIsFileUploadActive("open")}
          onTitleChanged={(data) => {
            setState((state) => ({ ...state, ...data }));
            setStage(stage + 1);
          }}
        />
      ) : stage === 1 ? (
        <SongUploader
          onAudioFileReceived={(audioUrl) => {
            setState((state) => ({ ...state, audioUrl }));
            setStage(stage + 1);
          }}
        />
      ) : (
        <SongCreator
          url={state.audioUrl}
          onReset={() => {
            setState(null);
            setStage(0);
          }}
          {...(state.song && state.images
            ? {
                defaults: {
                  song: state.song,
                  images: state.images
                }
              }
            : {})}
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
