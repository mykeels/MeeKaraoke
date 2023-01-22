import React from "react";
import { useNavigate } from "react-router-dom";
import { setDefaultProps } from "../../common";

import { getLyrics, getLyricsOptions } from "../../common/services";
import { TitleCreator } from "./TitleCreator";

type TitleCreatorScreenProps = {
  className?: any;
  onTitleChanged?: (data: { title: string; lyrics: string }) => any;
  onFileUploadIntent?: () => any;
  TitleCreator?: React.FC<
    Pick<Parameters<typeof TitleCreator>[0], "onTitleChanged">
  >;
};

export const TitleCreatorScreen = ({
  onTitleChanged,
  TitleCreator
}: TitleCreatorScreenProps) => {
  const navigate = useNavigate();
  return typeof TitleCreator === "function" ? (
    <TitleCreator
      onTitleChanged={(data) => {
        if (typeof onTitleChanged === "function") {
          onTitleChanged(data);
          navigate("/create/upload-audio");
        }
      }}
    />
  ) : null;
};

setDefaultProps(TitleCreatorScreen, {
  TitleCreator: (props) => (
    <TitleCreator
      {...props}
      getLyrics={getLyrics}
      getLyricsOptions={getLyricsOptions}
    />
  )
});
