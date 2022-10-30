import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import {
  SongCreator,
  TitleCreatorScreen,
  SongPlayerScreen,
  SongPicker,
  SongUploaderScreen,
  SongUploader
} from "./components";
import { LyricsTabView } from "./components/SongCreator/components/LyricsTabView";
import { getSongById, saveSongFileContents } from "./common/services";

/** @type {React.FC<{ Router?: React.FC<{ basename?: string, children: any }> }>} */
export const App = () => {
  /** @type {ReactState<SongFileContent>} */
  const [state, setState] = useState(null);
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
              onFileUploadIntent={() => {}}
              onTitleChanged={(data) => {
                setState((state) => ({ ...state, ...data }));
              }}
            />
          }
        />
        <Route
          path="/create/upload-audio"
          element={
            <SongUploaderScreen
              onAudioFileReceived={(audioUrl) => {
                setState((state) => ({ ...state, audioUrl }));
              }}
              SongUploader={(props) => (
                <SongUploader {...props} title={state?.title} />
              )}
            />
          }
        />
        <Route
          path="/create/:id"
          element={
            state?.audioUrl ? (
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
            ) : null
          }
        />
        <Route
          path="/create"
          element={
            state?.audioUrl ? (
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
            ) : null
          }
        />
      </Routes>
    </>
  );
};

App.defaultProps = {};
