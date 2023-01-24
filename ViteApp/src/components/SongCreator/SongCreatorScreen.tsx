import React from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";

import { getSongById, saveSongFileContents } from "../../common/services";
import { LyricsTabView } from "./components/LyricsTabView";
import { SongCreator } from "./SongCreator";
import { useCacheInvalidation } from "../../hooks";
import { assert } from "../../common";

type SongCreatorScreenProps = {
  className?: any;
  SongCreator?: React.FC<Parameters<typeof SongCreator>[0]>;
  getSongById?: (id: string) => Promise<SongFileContent>;
  saveSongFileContents?: (content: SongFileContent) => Promise<SongFileContent>;
};

export const SongCreatorScreen = ({
  SongCreator,
  getSongById,
  saveSongFileContents
}: SongCreatorScreenProps) => {
  const { id } = useParams();
  const { data: song } = useQuery(["songs", id], () => assert(getSongById)(assert(id)));
  const { updateCache } = useCacheInvalidation(["songs", assert(id)]);
  const { mutateAsync: saveSong } = useMutation(assert(saveSongFileContents), {
    onMutate: (variables) => {
      updateCache((content) => ({ ...content, ...variables, id }));
    }
  });
  return song && SongCreator ? (
    <SongCreator
      id={id}
      audioUrl={song.audioUrl}
      title={song.title}
      defaults={{
        lines: song?.lines || [],
        background: song?.background
      }}
      onSave={async (content) => {
        return saveSong({
          ...content,
          audioUrl: content.audioUrl
        });
      }}
      LyricsTabView={(props) => (
        <LyricsTabView
          {...props}
          title={song?.title}
          defaults={{
            active: "pretty",
            text: song?.lyrics
          }}
        />
      )}
    />
  ) : null;
};

SongCreatorScreen.defaultProps = {
  SongCreator,
  getSongById,
  saveSongFileContents
};
