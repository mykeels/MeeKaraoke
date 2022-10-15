import React, { useState } from "react";
import { SongCreator, SongUploader, TitleCreator } from "./components";
import { LyricsTabView } from "./components/SongCreator/components/LyricsTabView";

/** @type {React.FC<{}>} */
export const App = () => {
  /** @type {ReactState<number>} */
  const [stage, setStage] = useState(0);
  /** @type {ReactState<{ title: string, lyrics: string, audioUrl: string }>} */
  const [state, setState] = useState(null);
  return (
    <div className="block overflow-auto custom-scroller h-screen">
      {stage === 0 ? (
        <TitleCreator
          onSkip={() => setStage(stage + 1)}
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
