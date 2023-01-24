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
import { SongCreatorScreen } from "./components/SongCreator";
import { assert, Redirect, setDefaultProps } from "./common";
import { SongExporterScreen } from "./components/SongExporter";

type AppProps = {
  getSongById?: (id: string) => Promise<SongFileContent>;
  saveSongFileContents?: (content: SongFileContent) => Promise<SongFileContent>;
  SongPicker?: React.FC<
    Pick<
      Parameters<typeof SongPicker>[0],
      "onNewSong" | "onSelectSong" | "onPlaySong"
    >
  >;
};

export const App = ({
  getSongById,
  saveSongFileContents,
  SongPicker
}: AppProps) => {
  /** @type {ReactState<SongFileContent>} */
  const [state, setState] = useState<SongFileContent | null>(null);
  const navigate = useNavigate();
  const selectSong = async (record: { id: string }) => {
    const song = await assert(getSongById)(record.id);
    setState(song);
    navigate(`/create/${song.id}`);
  };
  const playSong = async (record: { id: string }) => {
    const song = await assert(getSongById)(record.id);
    setState(song);

    navigate(`/play/${song.id}`);
  };
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            SongPicker && (
              <SongPicker
                onNewSong={() => {
                  navigate("/create/set-title");
                }}
                onSelectSong={selectSong}
                onPlaySong={playSong}
              />
            )
          }
        />
        <Route
          path="/play/:id"
          element={<SongPlayerScreen getSongById={getSongById} />}
        />
        <Route
          path="/create/set-title"
          element={
            <TitleCreatorScreen
              onTitleChanged={(data) => {
                setState((state) => ({
                  ...((state || {}) as any),
                  ...data
                }));
              }}
            />
          }
        />
        <Route
          path="/create/upload-audio"
          element={
            <SongUploaderScreen
              onAudioFileReceived={(audioUrl) => {
                setState((state) => ({
                  ...((state || {}) as any),
                  audioUrl,
                  background: {
                    type: "images",
                    colors: [
                      `#00aaff`,
                      `#ffaa00`,
                      `#0000ff`,
                      `#00ff00`,
                      `#ff0000`,
                      `#00aaff`
                    ],
                    images: []
                  }
                }));
              }}
              SongUploader={(props) => (
                <SongUploader {...props} title={state?.title} />
              )}
            />
          }
        />
        <Route
          path="/create"
          element={
            state?.audioUrl ? (
              <SongCreator
                title={state?.title}
                audioUrl={state?.audioUrl}
                onReset={() => {
                  setState(null);
                  navigate("/");
                }}
                defaults={{
                  lines: state?.lines || [],
                  background: state?.background
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
                onSave={async (content) => {
                  content["id"] = state?.id;
                  return assert(saveSongFileContents)({
                    ...content,
                    id: state?.id,
                    audioUrl: state?.audioUrl,
                    lyrics: ""
                  }).then((content) => {
                    setState({ ...state, id: content.id });
                    navigate(`/create/${content.id}`);
                  });
                }}
              />
            ) : (
              <Redirect to="/" />
            )
          }
        />
        <Route
          path="/create/:id"
          element={
            <SongCreatorScreen
              getSongById={getSongById}
              SongCreator={(props) => (
                <SongCreator
                  {...props}
                  onReset={() => {
                    setState(null);
                    navigate("/");
                  }}
                />
              )}
            />
          }
        />
        <Route path="/exports" element={<SongExporterScreen />} />
      </Routes>
    </>
  );
};

setDefaultProps(App, {
  getSongById,
  saveSongFileContents,
  SongPicker: (props) => <SongPicker {...props} />
});
