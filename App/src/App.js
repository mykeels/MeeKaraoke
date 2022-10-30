import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import {
  SongCreator,
  SongUploader,
  TitleCreatorScreen,
  SongPlayerScreen,
  SongPicker,
  SavedFileUploader
} from "./components";
import { LyricsTabView } from "./components/SongCreator/components/LyricsTabView";
import { getSongById, saveSongFileContents } from "./common/services";

/** @type {React.FC<{ Router?: React.FC<{ basename?: string, children: any }> }>} */
export const App = () => {
  /** @type {ReactState<SongFileContent>} */
  const [state, setState] = useState(null);
  /** @type {ReactState<boolean | "open">} */
  const [isFileUploadActive, setIsFileUploadActive] = useState(false);
  const navigate = useNavigate();
  const selectSong = async (record) => {
    const song = await getSongById(record.id);
    setState(song);
    navigate(`/create/${song.id}`);
  };
  const playSong = async (record) => {
    const song = await getSongById(record.id);
    setState(song);

    navigate(`/play/${song.id}`);
  };
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <SongPicker
              onNewSong={() => {
                navigate("/create/set-title");
              }}
              onSelectSong={selectSong}
              onPlaySong={playSong}
            />
          }
        />
        <Route path="/play/:id" element={<SongPlayerScreen />} />
        <Route
          path="/create/set-title"
          element={
            <TitleCreatorScreen
              onFileUploadIntent={() => setIsFileUploadActive("open")}
              onTitleChanged={(data) => {
                setState((state) => ({ ...state, ...data }));
              }}
            />
          }
        />
        <Route
          path="/create/upload-audio"
          element={
            <SongUploader
              onAudioFileReceived={(audioUrl) => {
                setState((state) => ({ ...state, audioUrl }));
              }}
            />
          }
        />
        <Route
          path="/create/:id"
          element={
            <SongCreator
              title={state?.title}
              url={state?.audioUrl}
              onReset={() => {
                setState(null);
                navigate("/");
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
                    text: state?.lyrics
                  }}
                />
              )}
              onSave={(content) => {
                content["id"] = state?.id;
                return saveSongFileContents({
                  ...content,
                  id: state?.id,
                  audioUrl: state?.audioUrl,
                  lyrics: ""
                }).then((content) => setState({ ...state, id: content.id }));
              }}
            />
          }
        />
      </Routes>
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
              navigate("/create/upload-audio");
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFileUploadActive(false);
            }}
          />
        ) : null}
      </div>
    </>
  );
};

App.defaultProps = {};
