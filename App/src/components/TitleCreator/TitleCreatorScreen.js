import React from "react";
import { useNavigate } from "react-router-dom";

import { getLyrics, getLyricsOptions } from "../../common/services";
import { TitleCreator } from "./TitleCreator";

/**
 * @typedef {object} TitleCreatorScreenProps
 * @property {any} [className]
 * @property {(data: { title: string, lyrics: string }) => any} [onTitleChanged]
 * @property {() => any} [onFileUploadIntent]
 * @property {React.FC<Pick<import("./TitleCreator").TitleCreatorProps, "onFileUploadIntent" | "onTitleChanged">>} [TitleCreator]
 */

/**
 * @type {React.FC<TitleCreatorScreenProps & { [key: string]: any }>}
 */
export const TitleCreatorScreen = ({
  onFileUploadIntent,
  onTitleChanged,
  TitleCreator
}) => {
  const navigate = useNavigate();
  return (
    <TitleCreator
      onFileUploadIntent={onFileUploadIntent}
      onTitleChanged={(data) => {
        if (typeof onTitleChanged === "function") {
          onTitleChanged(data);
          navigate("/create/upload-audio");
        }
      }}
    />
  );
};

TitleCreatorScreen.defaultProps = {
  TitleCreator: (props) => (
    <TitleCreator
      {...props}
      getLyrics={getLyrics}
      getLyricsOptions={getLyricsOptions}
    />
  )
};
